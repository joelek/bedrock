# @joelek/bedrock

Sort-aware and extensible serialization format with distinguished encoding rules.

<pre>
08 04 04 6B 65 79 06 04 76 61 6C 75 65

08 (map tag)
    04 (packet, 0x04 byte payload)
        04 (string tag)
            6B 65 79 ("key")
    06 (packet, 0x06 byte payload)
        04 (string tag)
            76 61 6C 75 65 ("value")

{ "key": "value" }
</pre>

## Background

Application developers have many different options when it comes to selecting data serialization formats. In many cases, the choice is simple due to the requirements of the application in question.

Every serialization format comes with a unique set of features and is often designed for either general or specific uses. Applications that communicate with external systems often use standardized and well-defined formats such as [JSON](https://en.wikipedia.org/wiki/JSON) or [XML](https://en.wikipedia.org/wiki/XML). Applications that communicate with internal systems may use specialized formats such as [Protobuf](https://en.wikipedia.org/wiki/Protocol_Buffers) or [Avro](https://en.wikipedia.org/wiki/Apache_Avro) while cryptographic applications often use [ASN.1](https://en.wikipedia.org/wiki/ASN.1).

|                    | JSON       | XML           | ASN.1 (DER)   | Protobuf   | Avro          | Bedrock       |
| ------------------ | ---------- | ------------- | ------------- | ---------- | ------------- | ------------- |
| **Type system**    | Fixed      | :sweat_smile: | Extensible    | Extensible | Extensible    | Extensible    |
| **Encoding rules** | Flexible   | Flexible      | Distinguished | Flexible   | Flexible      | Distinguished |
| **Overhead**       | Medium     | High          | Low           | Low        | Low           | Medium        |
| **Complexity**     | Low        | Low           | High          | High       | High          | High          |
| **Segmentation**   | Delimiters | Delimiters    | Prefix        | Prefix     | Prefix        | Prefix        |
| **Schema**         | Optional   | Optional      | Optional      | Optional   | Required      | Optional      |
| **Sort-aware**     | No         | No            | No            | No         | No            | Yes           |

* An extensible type system is needed to ensure that a specification can evolve while ensuring backwards comaptibility. Serialization formats with extensible type systems will be able to adapt as needs and requirements change.

* A serialization format with distinguished encoding rules specify every detail of the format so that there exists only one unique valid representation of the encoded data. Distinguished encoding rules are required for cryptographic applications.

* All serialization formats contain some amount of overhead. The overhead needs to be balanced against the features provided by the format but should generally be kept to a minimum.

* Different serialization formats have different complexity. Low complexity is generally favourable as low-complexity formats will gain adoption more easily. High-complexity formats will generally include more advanced features.

* Human-readable formats tend to use delimiters for segmentation. This is disirable as edits can be made without causing cascading changes to the serialized data. Unfortunately, it is terrible from a computing standpoint as unknown amounts of data must be parsed in order to extract subsets of the data. Advanced formats tend to use length prefixes instead of delimiters as it allows data to be handled more efficiently.

* Schemas may be used to augument data for some serialization formats while others outright require them for parsing to be possible. Formats that require schemas can reduce their overhead significantly at the cost of lowering the robustness of the data stored.

* Most serialization formats do not feature sort-aware serialization. Sort-aware serialization ensures that serialized data can be sorted by a generalized sorting algorithm, unaware of the type of the underlying data. This is useful for database applications.

Bedrock is a general-use serialization format with traits favoured by specialized applications.

## Features

### Codecs

Bedrock includes a `codecs` module that may be used to encode and decode data. The general `Any` codec may be used to encode any compatible data into the standardized Bedrock format.

```ts
import { codecs } from "@joelek/bedrock";
let codec = codecs.Any;
let encoded = codec.encode(["hello"]);
let decoded = coded.decode(encoded); // Inferred type is any.
```

Specialized codecs may be constructed from the building blocks found in the `codecs` module.

```ts
import { codecs } from "@joelek/bedrock";
let codec = codecs.Array.of(codecs.String);
let encoded = codec.encode(["hello"]);
let decoded = coded.decode(encoded); // Inferred type is Array<string>.
```

The `encoded` buffer will be identical in both examples as the same values are encoded. The actual types will be recovered for the `decoded` value in both examples with the only difference being the inferred formal type.

## Encoding rules

### VarLength

The `VarLength` encoding rule encodes non-negative integers using a variable length encoding. The rule reduces integers exponentially, favouring compactness over sort-order preservation making it suitable for use with integers of large or unknown magnitudes.

The scheme encodes integers into bytes where each byte has one control bit (bit 7) and seven data bits (bits 6,5,4,3,2,1,0).

Bit 7 indicates a termination (0) or a continuation (1) of the encoding while the data bits represent the integer when concatenated. The bytes are stored in big-endian (network) order.

The rule always uses the shortest encoding possible. This results in a distinguished encoding with exactly one unique representation making it suitable for cryptographic purposes.

<pre>
00 (0)
7F (127)
81 00 (128)
FF 7F (16383)
81 80 00 (16384)
</pre>

### VarInteger

The `VarInteger` encoding rule encodes integers using a variable length encoding. The rule reduces integers exponentially, favouring compactness over sort-order preservation making it suitable for use with integers of large or unknown magnitudes.

The rule encodes integers into bytes where each byte has two control bits (bits 7,6) and six data bits (bits 5,4,3,2,1,0).

Bit 7 indicates that the remaning bits of the byte (including bit 6) should be inverted (0) or interpreted as is (1). Bit 6 indicates a termination (0) or a continuation (1) of the encoding while the data bits represent the integer when concatenated. The bytes are stored in big-endian (network) order.

Non-negative integers are encoded as is while negative integers are encoded using the two's complement transform which defines the relationships `bits = invert(encode((0 - integer) - 1))` and `integer = 0 - (decode(invert(bits)) + 1)`. The use of the transform is indicated by bit 7 of each byte being set to inverted (0).

The rule always uses the shortest encoding possible. This results in a distinguished encoding with exactly one unique representation making it suitable for cryptographic purposes.

<pre>
3E 3F 7F (-4097)
00 40 (-4096)
3E 7F (-65)
40 (-64)
7F (-1)
80 (0)
BF (63)
C1 80 (64)
FF BF (4095)
C1 C0 80 (4096)
</pre>

### VarCategory

The `VarCategory` encoding rule encodes integers using a variable length encoding. The rule reduces integers linearly, favouring sort-order preservation over compactness making it unsuitable for use with integers of large or unknown magnitudes.

The rule encodes integers into bytes where each byte has two control bits (bits 7,6) and six data bits (bits 5,4,3,2,1,0).

Bit 7 indicates that the remaning bits of the byte (including bit 6) should be inverted (0) or interpreted as is (1). Bit 6 indicates a termination (0) or a continuation (1) of the encoding while the data bits represent the integer when summed. The bytes are stored in big-endian (network) order.

Non-negative integers are encoded as is while negative integers are encoded using the two's complement transform which defines the relationships `bits = invert(encode((0 - integer) - 1))` and `integer = 0 - (decode(invert(bits)) + 1)`. The use of the transform is indicated by bit 7 of each byte being set to inverted (0).

The rule always uses the shortest encoding possible. This results in a distinguished encoding with exactly one unique representation making it suitable for cryptographic purposes.

<pre>
00 00 7E (-128)
00 40 (-127)
00 7E (-65)
40 (-64)
7F (-1)
80 (0)
BF (63)
FF 81 (64)
FF BF (126)
FF FF 81 (127)
</pre>

## Packetization

Bedrock defines a simple packetization format that is used to define boundaries between encoded data. Each packet begins with the byte length of the payload encoded using the `VarLength` encoding rule followed by the raw payload.

## Types

Bedrock defines the following types where each type is identified through a tag corresponding to the given type. The packet of a payload always begins with the tag which is encoded as a single unsigned integer. Types may encode additional payload data as detailed below.

Please note that all examples display payload data and not packetized data. Packetized data would be prefixed by the byte length of the payload encoded using the `VarLength` encoding rule.

### Null

The Null type is used to represent the absence of a value. Null types are encoded using the tag `00` do not encode additional payload data.

<pre>
00 (null)
</pre>

### False

The False type is used to represent a value with two distinct states with the value being in the negative state. False types are encoded using the tag `01` and do not encode additional payload data.

<pre>
01 (false)
</pre>

### True

The True type is used to represent a value with two distinct states with the value being in the positive state. True types are encoded using the tag `02` and do not encode additional payload data.

<pre>
02 (true)
</pre>

### Number

The Number type is used to represent real numbers. Number types are encoded using the tag `03` and encode additional payload data.

The additional payload data is encoded using a sort-aware variant of the binary64 format specified in IEEE 754 standard. A bitwise XOR operation is applied to the encoded binary64 data where `0xFFFFFFFFFFFFFFFF` and `0x8000000000000000` are used as masks for negative and non-negative numbers, respectively.

<pre>
03 40 0F FF FF FF FF FF FF (-1)
03 80 00 00 00 00 00 00 00 (0)
03 BF F0 00 00 00 00 00 00 (1)
</pre>

### String

The String type is used to represent unicode text. String types are encoded using the tag `04` and encode additional payload data.

The additional payload data consists of zero or more unicode code points encoded using the sort-aware `UTF-8` encoding scheme.

<pre>
04 F0 9F 9A 80 ("🚀")
</pre>

### Binary

The Binary type is used to represent binary data. Binary types are encoded using the tag `05` and encode additional payload data.

The additional payload data consists of zero or more bytes and is inherently sort-aware.

<pre>
05 FF (0xFF)
</pre>

### BigInt

The BigInt type is used to represent negative and non-negative integers of unlimited magnitudes using a compact notation. BigInt types are encoded using the tag `06` and encode additional payload data.

The additional payload data consists of two parts of which the first is the category of the integer. The category is an integer itself and is encoded using the `VarCategory` rule.

The category indicates the number of bytes used to encode the integer. Negative categories are used to represent negative integers and non-negative categories are used to represent non-negative integers.

For negative categories, the number of bytes used to encode the integer is equal to `0 - category`. For non-negative categories, the number of bytes used to encode the integer is equal to `category + 1`.

The second part of the additional payload data encodes the integer itself.

Non-negative integers are encoded as is while negative integers are encoded using the two's complement transform which defines the relationships `bits = invert(encode((0 - integer) - 1))` and `integer = 0 - (decode(invert(bits)) + 1)`. The use of the transform is indicated by the category being negative.

The integers are encoded using big-endian (network) byte order and always use the shortest encoding possible. This results in a distinguished encoding with exactly one unique representation making it suitable for cryptographic purposes.

<pre>
06 7E FE FF (-257)
06 7F 00 (-256)
06 7F FF (-1)
06 80 00 (0)
06 80 FF (255)
06 81 01 00 (256)
</pre>

### List

The List type is used to represent sequential data. List types are encoded using the tag `07` and encode additional payload data.

The additional payload data consists of zero or more packets concatenated without the use of padding.

<pre>
07 05 04 6A 6F 65 6C 03 04 65 6B

07 (list tag)
    05 (packet, 0x05 byte payload)
        04 (string tag)
            6A 6F 65 6C ("joel")
    03 (packet, 0x03 byte payload)
        04 (string tag)
            65 6B ("ek")

["joel", "ek"]
</pre>

### Map

The Map type is used to represent associative data. Map types are encoded using the tag `08` and encode additional payload data.

The additional payload data consists of alternating key and value packets concatenated without the use of padding. Key packets are always encoded as strings but values may be encoded using any type.

The packet pairs are stored in the order determined by the sort-order of the payload data of the keys. This results in a distinguished encoding with exactly one unique representation making it suitable for cryptographic purposes.

<pre>
08 05 04 6E 61 6D 65 05 04 6A 6F 65 6C

08 (map tag)
    05 (packet, 0x05 byte payload)
        04 (string tag)
            6E 61 6D 65 ("name")
    05 (packet, 0x05 byte payload)
        04 (string tag)
            6A 6F 65 6C ("joel")

{ "name": "joel" }
</pre>

## Sponsorship

The continued development of this software depends on your sponsorship. Please consider sponsoring this project if you find that the software creates value for you and your organization.

The sponsor button can be used to view the different sponsoring options. Contributions of all sizes are welcome.

Thank you for your support!

### Ethereum

Ethereum contributions can be made to address `0xf1B63d95BEfEdAf70B3623B1A4Ba0D9CE7F2fE6D`.

![](./eth.png)

## Installation

Releases follow semantic versioning and release packages are published using the GitHub platform. Use the following command to install the latest release.

```
npm install joelek/bedrock#semver:^0.4
```

Use the following command to install the very latest build. The very latest build may include breaking changes and should not be used in production environments.

```
npm install joelek/bedrock#master
```

NB: This project targets TypeScript 4 in strict mode.

## Roadmap

* Move common functionality to stdlib.
* Decide whether RecordCodec should code Record<string, V> or Record<string, V | undefined>.
* Implement functionality for coding absent object members.
