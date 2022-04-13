"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooleanLiteral = exports.BooleanLiteralCodec = exports.BigIntLiteral = exports.BigIntLiteralCodec = exports.NumberLiteral = exports.NumberLiteralCodec = exports.StringLiteral = exports.StringLiteralCodec = exports.Integer = exports.IntegerCodec = exports.Intersection = exports.IntersectionCodec = exports.Union = exports.UnionCodec = exports.Object = exports.ObjectCodec = exports.Tuple = exports.TupleCodec = exports.Record = exports.RecordCodec = exports.Array = exports.ArrayCodec = exports.Boolean = exports.BooleanCodec = exports.Unknown = exports.UnknownCodec = exports.UnknownValue = exports.Map = exports.MapCodec = exports.List = exports.ListCodec = exports.BigInt = exports.BigIntCodec = exports.Binary = exports.BinaryCodec = exports.String = exports.StringCodec = exports.Number = exports.NumberCodec = exports.True = exports.TrueCodec = exports.False = exports.FalseCodec = exports.Null = exports.NullCodec = exports.Any = exports.AnyCodec = exports.Codec = exports.Tag = exports.Packet = void 0;
exports.IntegerLiteral = exports.IntegerLiteralCodec = void 0;
const utils = require("./utils");
class Packet {
    constructor() { }
    static decode(parser) {
        parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
        return parser.try((parser) => {
            let length = utils.VarLength.decode(parser);
            let payload = parser.chunk(length);
            return payload;
        });
    }
    static encode(payload) {
        return utils.Chunk.concat([
            utils.VarLength.encode(payload.length),
            payload
        ]);
    }
}
exports.Packet = Packet;
;
var Tag;
(function (Tag) {
    Tag[Tag["NULL"] = 0] = "NULL";
    Tag[Tag["FALSE"] = 1] = "FALSE";
    Tag[Tag["TRUE"] = 2] = "TRUE";
    Tag[Tag["NUMBER"] = 3] = "NUMBER";
    Tag[Tag["STRING"] = 4] = "STRING";
    Tag[Tag["BINARY"] = 5] = "BINARY";
    Tag[Tag["BIGINT"] = 6] = "BIGINT";
    Tag[Tag["LIST"] = 7] = "LIST";
    Tag[Tag["MAP"] = 8] = "MAP";
})(Tag = exports.Tag || (exports.Tag = {}));
;
class Codec {
    constructor() { }
    decode(parser, path = "") {
        let payload = Packet.decode(parser);
        return this.decodePayload(payload, path);
    }
    encode(subject, path = "") {
        let payload = this.encodePayload(subject, path);
        return Packet.encode(payload);
    }
}
exports.Codec = Codec;
;
class AnyCodec extends Codec {
    constructor() {
        super();
    }
    decodePayload(parser, path = "") {
        parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
        return parser.tryArray([
            (parser) => exports.Null.decodePayload(parser, path),
            (parser) => exports.False.decodePayload(parser, path),
            (parser) => exports.True.decodePayload(parser, path),
            (parser) => exports.Number.decodePayload(parser, path),
            (parser) => exports.String.decodePayload(parser, path),
            (parser) => exports.Binary.decodePayload(parser, path),
            (parser) => exports.BigInt.decodePayload(parser, path),
            (parser) => exports.List.decodePayload(parser, path),
            (parser) => exports.Map.decodePayload(parser, path),
            (parser) => exports.Unknown.decodePayload(parser, path)
        ]);
    }
    encodePayload(subject, path = "") {
        try {
            return exports.Null.encodePayload(subject, path);
        }
        catch (error) { }
        try {
            return exports.False.encodePayload(subject, path);
        }
        catch (error) { }
        try {
            return exports.True.encodePayload(subject, path);
        }
        catch (error) { }
        try {
            return exports.Number.encodePayload(subject, path);
        }
        catch (error) { }
        try {
            return exports.String.encodePayload(subject, path);
        }
        catch (error) { }
        try {
            return exports.Binary.encodePayload(subject, path);
        }
        catch (error) { }
        try {
            return exports.BigInt.encodePayload(subject, path);
        }
        catch (error) { }
        try {
            return exports.List.encodePayload(subject, path);
        }
        catch (error) { }
        try {
            return exports.Map.encodePayload(subject, path);
        }
        catch (error) { }
        try {
            return exports.Unknown.encodePayload(subject, path);
        }
        catch (error) { }
        throw `Expected subject to be encodable!`;
    }
}
exports.AnyCodec = AnyCodec;
;
exports.Any = new AnyCodec();
class NullCodec extends Codec {
    constructor() {
        super();
    }
    decodePayload(parser, path = "") {
        parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
        return parser.try((parser) => {
            if (parser.unsigned(1) !== Tag.NULL) {
                throw `Expected Null at ${path}!`;
            }
            return null;
        });
    }
    encodePayload(subject, path = "") {
        if (subject !== null) {
            throw `Expected Null at ${path}!`;
        }
        let chunks = [];
        chunks.push(Uint8Array.of(Tag.NULL));
        return utils.Chunk.concat(chunks);
    }
}
exports.NullCodec = NullCodec;
;
exports.Null = new NullCodec();
class FalseCodec extends Codec {
    constructor() {
        super();
    }
    decodePayload(parser, path = "") {
        parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
        return parser.try((parser) => {
            if (parser.unsigned(1) !== Tag.FALSE) {
                throw `Expected False at ${path}!`;
            }
            return false;
        });
    }
    encodePayload(subject, path = "") {
        if (subject !== false) {
            throw `Expected False at ${path}!`;
        }
        let chunks = [];
        chunks.push(Uint8Array.of(Tag.FALSE));
        return utils.Chunk.concat(chunks);
    }
}
exports.FalseCodec = FalseCodec;
;
exports.False = new FalseCodec();
class TrueCodec extends Codec {
    constructor() {
        super();
    }
    decodePayload(parser, path = "") {
        parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
        return parser.try((parser) => {
            if (parser.unsigned(1) !== Tag.TRUE) {
                throw `Expected True at ${path}!`;
            }
            return true;
        });
    }
    encodePayload(subject, path = "") {
        if (subject !== true) {
            throw `Expected True at ${path}!`;
        }
        let chunks = [];
        chunks.push(Uint8Array.of(Tag.TRUE));
        return utils.Chunk.concat(chunks);
    }
}
exports.TrueCodec = TrueCodec;
;
exports.True = new TrueCodec();
class NumberCodec extends Codec {
    constructor() {
        super();
    }
    decodePayload(parser, path = "") {
        parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
        return parser.try((parser) => {
            if (parser.unsigned(1) !== Tag.NUMBER) {
                throw `Expected Number at ${path}!`;
            }
            let chunk = parser.chunk(8);
            if (((chunk[0] >> 7) & 0x01) === 0x01) {
                chunk[0] ^= 0x80;
                for (let i = 1; i < chunk.length; i++) {
                    chunk[i] ^= 0x00;
                }
            }
            else {
                chunk[0] ^= 0xFF;
                for (let i = 1; i < chunk.length; i++) {
                    chunk[i] ^= 0xFF;
                }
            }
            let value = new DataView(chunk.buffer).getFloat64(0, false);
            return value;
        });
    }
    encodePayload(subject, path = "") {
        if (subject == null || subject.constructor !== globalThis.Number) {
            throw `Expected Number at ${path}!`;
        }
        let chunks = [];
        chunks.push(Uint8Array.of(Tag.NUMBER));
        let chunk = new Uint8Array(8);
        new DataView(chunk.buffer).setFloat64(0, subject, false);
        if (((chunk[0] >> 7) & 0x01) === 0x00) {
            chunk[0] ^= 0x80;
            for (let i = 1; i < chunk.length; i++) {
                chunk[i] ^= 0x00;
            }
        }
        else {
            chunk[0] ^= 0xFF;
            for (let i = 1; i < chunk.length; i++) {
                chunk[i] ^= 0xFF;
            }
        }
        chunks.push(chunk);
        return utils.Chunk.concat(chunks);
    }
}
exports.NumberCodec = NumberCodec;
;
exports.Number = new NumberCodec();
class StringCodec extends Codec {
    constructor() {
        super();
    }
    decodePayload(parser, path = "") {
        parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
        return parser.try((parser) => {
            if (parser.unsigned(1) !== Tag.STRING) {
                throw `Expected String at ${path}!`;
            }
            let value = utils.Chunk.toString(parser.chunk(), "utf-8");
            return value;
        });
    }
    encodePayload(subject, path = "") {
        if (subject == null || subject.constructor !== globalThis.String) {
            throw `Expected String at ${path}!`;
        }
        let chunks = [];
        chunks.push(Uint8Array.of(Tag.STRING));
        chunks.push(utils.Chunk.fromString(subject, "utf-8"));
        return utils.Chunk.concat(chunks);
    }
}
exports.StringCodec = StringCodec;
;
exports.String = new StringCodec();
class BinaryCodec extends Codec {
    constructor() {
        super();
    }
    decodePayload(parser, path = "") {
        parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
        return parser.try((parser) => {
            if (parser.unsigned(1) !== Tag.BINARY) {
                throw `Expected Binary at ${path}!`;
            }
            let value = parser.chunk();
            return value;
        });
    }
    encodePayload(subject, path = "") {
        if (subject == null || subject.constructor !== globalThis.Uint8Array) {
            throw `Expected Binary at ${path}!`;
        }
        let chunks = [];
        chunks.push(Uint8Array.of(Tag.BINARY));
        chunks.push(subject);
        return utils.Chunk.concat(chunks);
    }
}
exports.BinaryCodec = BinaryCodec;
;
exports.Binary = new BinaryCodec();
class BigIntCodec extends Codec {
    constructor() {
        super();
    }
    decodePayload(parser, path = "") {
        parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
        return parser.try((parser) => {
            if (parser.unsigned(1) !== Tag.BIGINT) {
                throw `Expected BigInt at ${path}!`;
            }
            let category = utils.VarCategory.decode(parser);
            let value = 0n;
            if (category >= 0) {
                let size = category + 1;
                for (let i = 0; i < size; i++) {
                    let byte = globalThis.BigInt(parser.unsigned(1));
                    value = value << 8n;
                    value = value | byte;
                }
            }
            else {
                let size = 0 - category;
                for (let i = 0; i < size; i++) {
                    let byte = globalThis.BigInt(~parser.unsigned(1) & 0xFF);
                    value = value << 8n;
                    value = value | byte;
                }
                value = value + 1n;
                value = 0n - value;
            }
            return value;
        });
    }
    encodePayload(subject, path = "") {
        if (subject == null || subject.constructor !== globalThis.BigInt) {
            throw `Expected BigInt at ${path}!`;
        }
        let chunks = [];
        chunks.push(Uint8Array.of(Tag.BIGINT));
        let bytes = [];
        let value = subject;
        if (value >= 0n) {
            do {
                let byte = globalThis.Number(value & 0xffn);
                value = value >> 8n;
                bytes.push(byte);
            } while (value > 0n);
            let category = utils.VarCategory.encode(bytes.length - 1);
            chunks.push(category);
        }
        else {
            value = 0n - value;
            value = value - 1n;
            do {
                let byte = ~globalThis.Number(value & 0xffn) & 0xFF;
                value = value >> 8n;
                bytes.push(byte);
            } while (value > 0n);
            let category = utils.VarCategory.encode(0 - bytes.length);
            chunks.push(category);
        }
        bytes.reverse();
        chunks.push(Uint8Array.from(bytes));
        return utils.Chunk.concat(chunks);
    }
}
exports.BigIntCodec = BigIntCodec;
;
exports.BigInt = new BigIntCodec();
class ListCodec extends Codec {
    constructor() {
        super();
    }
    decodePayload(parser, path = "", decode) {
        parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
        return parser.try((parser) => {
            if (parser.unsigned(1) !== Tag.LIST) {
                throw `Expected List at ${path}!`;
            }
            decode = decode ?? ((key, path, parser) => exports.Any.decode(parser, path));
            let value = [];
            let index = 0;
            while (!parser.eof()) {
                let subpath = `${path}[${index}]`;
                value.push(decode(index, subpath, parser));
                index += 1;
            }
            return value;
        });
    }
    encodePayload(subject, path = "", encode) {
        if (subject == null || subject.constructor !== globalThis.Array) {
            throw `Expected List at ${path}!`;
        }
        encode = encode ?? ((key, path, subject) => exports.Any.encode(subject, path));
        let chunks = [];
        chunks.push(Uint8Array.of(Tag.LIST));
        for (let index = 0; index < subject.length; index++) {
            let value = subject[index];
            if (value === undefined) {
                value = null;
            }
            let subpath = `${path}[${index}]`;
            chunks.push(encode(index, subpath, value));
        }
        return utils.Chunk.concat(chunks);
    }
}
exports.ListCodec = ListCodec;
;
exports.List = new ListCodec();
class MapCodec extends Codec {
    constructor() {
        super();
    }
    decodePayload(parser, path = "", decode) {
        parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
        return parser.try((parser) => {
            if (parser.unsigned(1) !== Tag.MAP) {
                throw `Expected Map at ${path}!`;
            }
            decode = decode ?? ((key, path, parser) => exports.Any.decode(parser, path));
            let value = {};
            while (!parser.eof()) {
                let key = exports.String.decode(parser);
                let subpath = /^[a-z][a-z0-9_]*$/isu.test(key) ? `${path}.${key}` : `${path}["${key}"]`;
                value[key] = decode(key, subpath, parser);
            }
            return value;
        });
    }
    encodePayload(subject, path = "", encode) {
        if (subject == null || subject.constructor !== globalThis.Object) {
            throw `Expected Map at ${path}!`;
        }
        encode = encode ?? ((key, path, subject) => exports.Any.encode(subject, path));
        let chunks = [];
        chunks.push(Uint8Array.of(Tag.MAP));
        let pairs = [];
        for (let key in subject) {
            let value = subject[key];
            if (value === undefined) {
                continue;
            }
            let subpath = /^[a-z][a-z0-9_]*$/isu.test(key) ? `${path}.${key}` : `${path}["${key}"]`;
            pairs.push({
                key: exports.String.encodePayload(key),
                value: encode(key, subpath, value)
            });
        }
        pairs.sort((one, two) => utils.Chunk.comparePrefixes(one.key, two.key));
        for (let pair of pairs) {
            chunks.push(Packet.encode(pair.key));
            chunks.push(pair.value);
        }
        return utils.Chunk.concat(chunks);
    }
}
exports.MapCodec = MapCodec;
;
exports.Map = new MapCodec();
class UnknownValue {
    chunk;
    constructor(chunk) {
        utils.IntegerAssert.atLeast(1, chunk.length);
        if (chunk[0] in Tag) {
            throw `Expected tag ${Tag[chunk[0]]} to be unknown!`;
        }
        this.chunk = chunk;
    }
    getChunk() {
        return this.chunk;
    }
}
exports.UnknownValue = UnknownValue;
;
class UnknownCodec extends Codec {
    constructor() {
        super();
    }
    decodePayload(parser, path = "") {
        parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
        return parser.try((parser) => {
            let value = parser.chunk();
            return new UnknownValue(value);
        });
    }
    encodePayload(subject, path = "") {
        if (subject == null || subject.constructor !== UnknownValue) {
            throw `Expected Unknown at ${path}!`;
        }
        let chunks = [];
        chunks.push(subject.getChunk());
        return utils.Chunk.concat(chunks);
    }
}
exports.UnknownCodec = UnknownCodec;
;
exports.Unknown = new UnknownCodec();
class BooleanCodec extends Codec {
    constructor() {
        super();
    }
    decodePayload(parser, path = "") {
        parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
        return parser.tryArray([
            (parser) => exports.True.decodePayload(parser, path),
            (parser) => exports.False.decodePayload(parser, path)
        ]);
    }
    encodePayload(subject, path = "") {
        if (subject) {
            return exports.True.encodePayload(subject, path);
        }
        else {
            return exports.False.encodePayload(subject, path);
        }
    }
}
exports.BooleanCodec = BooleanCodec;
;
exports.Boolean = new BooleanCodec();
class ArrayCodec extends Codec {
    codec;
    constructor(codec) {
        super();
        this.codec = codec;
    }
    decodePayload(parser, path = "") {
        return exports.List.decodePayload(parser, path, (index, path, parser) => {
            return this.codec.decode(parser, path);
        });
    }
    encodePayload(subject, path = "") {
        return exports.List.encodePayload(subject, path, (index, path, subject) => {
            return this.codec.encode(subject, path);
        });
    }
}
exports.ArrayCodec = ArrayCodec;
;
exports.Array = {
    of(codec) {
        return new ArrayCodec(codec);
    }
};
class RecordCodec extends Codec {
    codec;
    constructor(codec) {
        super();
        this.codec = codec;
    }
    decodePayload(parser, path = "") {
        return exports.Map.decodePayload(parser, path, (key, path, parser) => {
            return this.codec.decode(parser, path);
        });
    }
    encodePayload(subject, path = "") {
        return exports.Map.encodePayload(subject, path, (key, path, subject) => {
            return this.codec.encode(subject, path);
        });
    }
}
exports.RecordCodec = RecordCodec;
;
exports.Record = {
    of(codec) {
        return new RecordCodec(codec);
    }
};
class TupleCodec extends Codec {
    codecs;
    constructor(...codecs) {
        super();
        this.codecs = codecs;
    }
    decodePayload(parser, path = "") {
        parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
        return parser.try((parser) => {
            let indices = new globalThis.Set(this.codecs.keys());
            let subject = exports.List.decodePayload(parser, path, (index, path, parser) => {
                indices.delete(index);
                if (index in this.codecs) {
                    return this.codecs[index].decode(parser, path);
                }
                else {
                    return exports.Any.decode(parser, path);
                }
            });
            if (indices.size !== 0) {
                throw `Expected members ${globalThis.Array.from(indices)} to be decoded!`;
            }
            return subject;
        });
    }
    encodePayload(subject, path = "") {
        let indices = new globalThis.Set(this.codecs.keys());
        let payload = exports.List.encodePayload(subject, path, (index, path, subject) => {
            indices.delete(index);
            if (index in this.codecs) {
                return this.codecs[index].encode(subject, path);
            }
            else {
                return exports.Any.encode(subject, path);
            }
        });
        if (indices.size !== 0) {
            throw `Expected members ${globalThis.Array.from(indices)} to be encoded!`;
        }
        return payload;
    }
}
exports.TupleCodec = TupleCodec;
;
exports.Tuple = {
    of(...codecs) {
        return new TupleCodec(...codecs);
    }
};
class ObjectCodec extends Codec {
    required;
    optional;
    constructor(required, optional) {
        super();
        this.required = required;
        this.optional = optional ?? {};
    }
    decodePayload(parser, path = "") {
        parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
        return parser.try((parser) => {
            let keys = new Set(globalThis.Object.keys(this.required));
            let subject = exports.Map.decodePayload(parser, path, (key, path, parser) => {
                keys.delete(key);
                if (key in this.required) {
                    return this.required[key].decode(parser, path);
                }
                else if (key in this.optional) {
                    return this.optional[key].decode(parser, path);
                }
                else {
                    return exports.Any.decode(parser, path);
                }
            });
            if (keys.size !== 0) {
                throw `Expected members ${globalThis.Array.from(keys)} to be decoded!`;
            }
            return subject;
        });
    }
    encodePayload(subject, path = "") {
        let keys = new Set(globalThis.Object.keys(this.required));
        let payload = exports.Map.encodePayload(subject, path, (key, path, subject) => {
            keys.delete(key);
            if (key in this.required) {
                return this.required[key].encode(subject, path);
            }
            else if (key in this.optional) {
                return this.optional[key].encode(subject, path);
            }
            else {
                return exports.Any.encode(subject, path);
            }
        });
        if (keys.size !== 0) {
            throw `Expected members ${globalThis.Array.from(keys)} to be encoded!`;
        }
        return payload;
    }
}
exports.ObjectCodec = ObjectCodec;
;
exports.Object = {
    of(required, optional) {
        return new ObjectCodec(required, optional);
    }
};
class UnionCodec extends Codec {
    codecs;
    constructor(...codecs) {
        super();
        this.codecs = codecs;
    }
    decodePayload(parser, path = "") {
        for (let codec of this.codecs) {
            try {
                return codec.decodePayload(parser, path);
            }
            catch (error) { }
        }
        throw `Expected subject to be decodable!`;
    }
    encodePayload(subject, path = "") {
        for (let codec of this.codecs) {
            try {
                return codec.encodePayload(subject, path);
            }
            catch (error) { }
        }
        throw `Expected subject to be encodable!`;
    }
}
exports.UnionCodec = UnionCodec;
;
exports.Union = {
    of(...codecs) {
        return new UnionCodec(...codecs);
    }
};
class IntersectionCodec extends Codec {
    codecs;
    constructor(...codecs) {
        super();
        this.codecs = codecs;
    }
    decodePayload(parser, path = "") {
        for (let codec of this.codecs) {
            codec.decodePayload(parser, path);
        }
        return exports.Any.decodePayload(parser, path);
    }
    encodePayload(subject, path = "") {
        for (let codec of this.codecs) {
            codec.encodePayload(subject, path);
        }
        return exports.Any.encodePayload(subject, path);
    }
}
exports.IntersectionCodec = IntersectionCodec;
;
exports.Intersection = {
    of(...codecs) {
        return new IntersectionCodec(...codecs);
    }
};
class IntegerCodec extends Codec {
    constructor() {
        super();
    }
    decodePayload(parser, path = "") {
        let subject = exports.BigInt.decodePayload(parser, path);
        if (subject < globalThis.BigInt(globalThis.Number.MIN_SAFE_INTEGER)) {
            throw `Expected ${subject} at ${path} to be within safe range!`;
        }
        if (subject > globalThis.BigInt(globalThis.Number.MAX_SAFE_INTEGER)) {
            throw `Expected ${subject} at ${path} to be within safe range!`;
        }
        return globalThis.Number(subject);
    }
    encodePayload(subject, path = "") {
        return exports.BigInt.encodePayload(globalThis.BigInt(subject), path);
    }
}
exports.IntegerCodec = IntegerCodec;
;
exports.Integer = new IntegerCodec();
class StringLiteralCodec extends Codec {
    value;
    constructor(value) {
        super();
        this.value = value;
    }
    decodePayload(parser, path = "") {
        let subject = exports.String.decodePayload(parser, path);
        if (subject !== this.value) {
            throw `Expected "${this.value}" at ${path}!`;
        }
        return this.value;
    }
    encodePayload(subject, path = "") {
        if (subject !== this.value) {
            throw `Expected "${this.value}" at ${path}!`;
        }
        return exports.String.encodePayload(subject, path);
    }
}
exports.StringLiteralCodec = StringLiteralCodec;
;
exports.StringLiteral = {
    of(value) {
        return new StringLiteralCodec(value);
    }
};
class NumberLiteralCodec extends Codec {
    value;
    constructor(value) {
        super();
        this.value = value;
    }
    decodePayload(parser, path = "") {
        let subject = exports.Number.decodePayload(parser, path);
        if (subject !== this.value) {
            throw `Expected ${this.value} at ${path}!`;
        }
        return this.value;
    }
    encodePayload(subject, path = "") {
        if (subject !== this.value) {
            throw `Expected ${this.value} at ${path}!`;
        }
        return exports.Number.encodePayload(subject, path);
    }
}
exports.NumberLiteralCodec = NumberLiteralCodec;
;
exports.NumberLiteral = {
    of(value) {
        return new NumberLiteralCodec(value);
    }
};
class BigIntLiteralCodec extends Codec {
    value;
    constructor(value) {
        super();
        this.value = value;
    }
    decodePayload(parser, path = "") {
        let subject = exports.BigInt.decodePayload(parser, path);
        if (subject !== this.value) {
            throw `Expected ${this.value} at ${path}!`;
        }
        return this.value;
    }
    encodePayload(subject, path = "") {
        if (subject !== this.value) {
            throw `Expected ${this.value} at ${path}!`;
        }
        return exports.BigInt.encodePayload(subject, path);
    }
}
exports.BigIntLiteralCodec = BigIntLiteralCodec;
;
exports.BigIntLiteral = {
    of(value) {
        return new BigIntLiteralCodec(value);
    }
};
class BooleanLiteralCodec extends Codec {
    value;
    constructor(value) {
        super();
        this.value = value;
    }
    decodePayload(parser, path = "") {
        let subject = exports.Boolean.decodePayload(parser, path);
        if (subject !== this.value) {
            throw `Expected ${this.value} at ${path}!`;
        }
        return this.value;
    }
    encodePayload(subject, path = "") {
        if (subject !== this.value) {
            throw `Expected ${this.value} at ${path}!`;
        }
        return exports.Boolean.encodePayload(subject, path);
    }
}
exports.BooleanLiteralCodec = BooleanLiteralCodec;
;
exports.BooleanLiteral = {
    of(value) {
        return new BooleanLiteralCodec(value);
    }
};
class IntegerLiteralCodec extends Codec {
    value;
    constructor(value) {
        super();
        this.value = value;
    }
    decodePayload(parser, path = "") {
        let subject = exports.Integer.decodePayload(parser, path);
        if (subject !== this.value) {
            throw `Expected ${this.value} at ${path}!`;
        }
        return this.value;
    }
    encodePayload(subject, path = "") {
        if (subject !== this.value) {
            throw `Expected ${this.value} at ${path}!`;
        }
        return exports.Integer.encodePayload(subject, path);
    }
}
exports.IntegerLiteralCodec = IntegerLiteralCodec;
;
exports.IntegerLiteral = {
    of(value) {
        return new IntegerLiteralCodec(value);
    }
};
