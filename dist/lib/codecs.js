"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooleanLiteral = exports.BooleanLiteralCodec = exports.BigIntLiteral = exports.BigIntLiteralCodec = exports.NumberLiteral = exports.NumberLiteralCodec = exports.StringLiteral = exports.StringLiteralCodec = exports.Intersection = exports.IntersectionCodec = exports.Union = exports.UnionCodec = exports.Object = exports.ObjectCodec = exports.Tuple = exports.TupleCodec = exports.Record = exports.RecordCodec = exports.Array = exports.ArrayCodec = exports.Boolean = exports.BooleanCodec = exports.Unknown = exports.UnknownCodec = exports.UnknownValue = exports.Map = exports.MapCodec = exports.List = exports.ListCodec = exports.BigInt = exports.BigIntCodec = exports.Binary = exports.BinaryCodec = exports.String = exports.StringCodec = exports.Number = exports.NumberCodec = exports.True = exports.TrueCodec = exports.False = exports.FalseCodec = exports.Null = exports.NullCodec = exports.Any = exports.AnyCodec = exports.Codec = exports.Tag = exports.Packet = void 0;
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
    decode(parser) {
        let payload = Packet.decode(parser);
        return this.decodePayload(payload);
    }
    encode(subject) {
        let payload = this.encodePayload(subject);
        return Packet.encode(payload);
    }
}
exports.Codec = Codec;
;
class AnyCodec extends Codec {
    constructor() {
        super();
    }
    decodePayload(parser) {
        parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
        return parser.tryArray([
            (parser) => exports.Null.decodePayload(parser),
            (parser) => exports.False.decodePayload(parser),
            (parser) => exports.True.decodePayload(parser),
            (parser) => exports.Number.decodePayload(parser),
            (parser) => exports.String.decodePayload(parser),
            (parser) => exports.Binary.decodePayload(parser),
            (parser) => exports.BigInt.decodePayload(parser),
            (parser) => exports.List.decodePayload(parser),
            (parser) => exports.Map.decodePayload(parser),
            (parser) => exports.Unknown.decodePayload(parser)
        ]);
    }
    encodePayload(subject) {
        try {
            return exports.Null.encodePayload(subject);
        }
        catch (error) { }
        try {
            return exports.False.encodePayload(subject);
        }
        catch (error) { }
        try {
            return exports.True.encodePayload(subject);
        }
        catch (error) { }
        try {
            return exports.Number.encodePayload(subject);
        }
        catch (error) { }
        try {
            return exports.String.encodePayload(subject);
        }
        catch (error) { }
        try {
            return exports.Binary.encodePayload(subject);
        }
        catch (error) { }
        try {
            return exports.BigInt.encodePayload(subject);
        }
        catch (error) { }
        try {
            return exports.List.encodePayload(subject);
        }
        catch (error) { }
        try {
            return exports.Map.encodePayload(subject);
        }
        catch (error) { }
        try {
            return exports.Unknown.encodePayload(subject);
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
    decodePayload(parser) {
        parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
        return parser.try((parser) => {
            utils.IntegerAssert.exactly(parser.unsigned(1), Tag.NULL);
            return null;
        });
    }
    encodePayload(subject) {
        if (subject !== null) {
            throw `Expected Null!`;
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
    decodePayload(parser) {
        parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
        return parser.try((parser) => {
            utils.IntegerAssert.exactly(parser.unsigned(1), Tag.FALSE);
            return false;
        });
    }
    encodePayload(subject) {
        if (subject !== false) {
            throw `Expected False!`;
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
    decodePayload(parser) {
        parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
        return parser.try((parser) => {
            utils.IntegerAssert.exactly(parser.unsigned(1), Tag.TRUE);
            return true;
        });
    }
    encodePayload(subject) {
        if (subject !== true) {
            throw `Expected True!`;
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
    decodePayload(parser) {
        parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
        return parser.try((parser) => {
            utils.IntegerAssert.exactly(parser.unsigned(1), Tag.NUMBER);
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
    encodePayload(subject) {
        if (subject == null || subject.constructor !== globalThis.Number) {
            throw `Expected Number!`;
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
    decodePayload(parser) {
        parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
        return parser.try((parser) => {
            utils.IntegerAssert.exactly(parser.unsigned(1), Tag.STRING);
            let value = utils.Chunk.toString(parser.chunk(), "utf-8");
            return value;
        });
    }
    encodePayload(subject) {
        if (subject == null || subject.constructor !== globalThis.String) {
            throw `Expected String!`;
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
    decodePayload(parser) {
        parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
        return parser.try((parser) => {
            utils.IntegerAssert.exactly(parser.unsigned(1), Tag.BINARY);
            let value = parser.chunk();
            return value;
        });
    }
    encodePayload(subject) {
        if (subject == null || subject.constructor !== globalThis.Uint8Array) {
            throw `Expected Binary!`;
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
    decodePayload(parser) {
        parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
        return parser.try((parser) => {
            utils.IntegerAssert.exactly(parser.unsigned(1), Tag.BIGINT);
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
    encodePayload(subject) {
        if (subject == null || subject.constructor !== globalThis.BigInt) {
            throw `Expected BigInt!`;
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
    decodePayload(parser, decode) {
        parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
        return parser.try((parser) => {
            utils.IntegerAssert.exactly(parser.unsigned(1), Tag.LIST);
            decode = decode ?? ((key, parser) => exports.Any.decode(parser));
            let value = [];
            let index = 0;
            while (!parser.eof()) {
                value.push(decode(index, parser));
                index += 1;
            }
            return value;
        });
    }
    encodePayload(subject, encode) {
        if (subject == null || subject.constructor !== globalThis.Array) {
            throw `Expected Array!`;
        }
        encode = encode ?? ((key, subject) => exports.Any.encode(subject));
        let chunks = [];
        chunks.push(Uint8Array.of(Tag.LIST));
        for (let index = 0; index < subject.length; index++) {
            let value = subject[index];
            if (value === undefined) {
                value = null;
            }
            chunks.push(encode(index, value));
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
    decodePayload(parser, decode) {
        parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
        return parser.try((parser) => {
            utils.IntegerAssert.exactly(parser.unsigned(1), Tag.MAP);
            decode = decode ?? ((key, parser) => exports.Any.decode(parser));
            let value = {};
            while (!parser.eof()) {
                let key = exports.String.decode(parser);
                value[key] = decode(key, parser);
            }
            return value;
        });
    }
    encodePayload(subject, encode) {
        if (subject == null || subject.constructor !== globalThis.Object) {
            throw `Expected Object!`;
        }
        encode = encode ?? ((key, subject) => exports.Any.encode(subject));
        let chunks = [];
        chunks.push(Uint8Array.of(Tag.MAP));
        let pairs = [];
        for (let key in subject) {
            let value = subject[key];
            if (value === undefined) {
                continue;
            }
            pairs.push({
                key: exports.String.encodePayload(key),
                value: encode(key, value)
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
    decodePayload(parser) {
        parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
        return parser.try((parser) => {
            let value = parser.chunk();
            return new UnknownValue(value);
        });
    }
    encodePayload(subject) {
        if (subject == null || subject.constructor !== UnknownValue) {
            throw `Expected Unknown!`;
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
    decodePayload(parser) {
        parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
        return parser.tryArray([
            (parser) => exports.True.decodePayload(parser),
            (parser) => exports.False.decodePayload(parser)
        ]);
    }
    encodePayload(subject) {
        if (subject) {
            return exports.True.encodePayload(subject);
        }
        else {
            return exports.False.encodePayload(subject);
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
    decodePayload(parser) {
        return exports.List.decodePayload(parser, (index, parser) => {
            return this.codec.decode(parser);
        });
    }
    encodePayload(subject) {
        return exports.List.encodePayload(subject, (index, subject) => {
            return this.codec.encode(subject);
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
    decodePayload(parser) {
        return exports.Map.decodePayload(parser, (key, parser) => {
            return this.codec.decode(parser);
        });
    }
    encodePayload(subject) {
        return exports.Map.encodePayload(subject, (key, subject) => {
            return this.codec.encode(subject);
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
    decodePayload(parser) {
        parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
        return parser.try((parser) => {
            let indices = new globalThis.Set(this.codecs.keys());
            let subject = exports.List.decodePayload(parser, (index, parser) => {
                indices.delete(index);
                if (index in this.codecs) {
                    return this.codecs[index].decode(parser);
                }
                else {
                    return exports.Any.decode(parser);
                }
            });
            if (indices.size !== 0) {
                throw `Expected members ${globalThis.Array.from(indices)} to be decoded!`;
            }
            return subject;
        });
    }
    encodePayload(subject) {
        let indices = new globalThis.Set(this.codecs.keys());
        let payload = exports.List.encodePayload(subject, (index, subject) => {
            indices.delete(index);
            if (index in this.codecs) {
                return this.codecs[index].encode(subject);
            }
            else {
                return exports.Any.encode(subject);
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
    codecs;
    constructor(codecs) {
        super();
        this.codecs = codecs;
    }
    decodePayload(parser) {
        parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
        return parser.try((parser) => {
            let keys = new Set(globalThis.Object.keys(this.codecs));
            let subject = exports.Map.decodePayload(parser, (key, parser) => {
                keys.delete(key);
                if (key in this.codecs) {
                    return this.codecs[key].decode(parser);
                }
                else {
                    return exports.Any.decode(parser);
                }
            });
            if (keys.size !== 0) {
                throw `Expected members ${globalThis.Array.from(keys)} to be decoded!`;
            }
            return subject;
        });
    }
    encodePayload(subject) {
        let keys = new Set(globalThis.Object.keys(this.codecs));
        let payload = exports.Map.encodePayload(subject, (key, subject) => {
            keys.delete(key);
            if (key in this.codecs) {
                return this.codecs[key].encode(subject);
            }
            else {
                return exports.Any.encode(subject);
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
    of(codecs) {
        return new ObjectCodec(codecs);
    }
};
class UnionCodec extends Codec {
    codecs;
    constructor(...codecs) {
        super();
        this.codecs = codecs;
    }
    decodePayload(parser) {
        for (let codec of this.codecs) {
            try {
                return codec.decodePayload(parser);
            }
            catch (error) { }
        }
        throw `Expected subject to be decodable!`;
    }
    encodePayload(subject) {
        for (let codec of this.codecs) {
            try {
                return codec.encodePayload(subject);
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
    decodePayload(parser) {
        for (let codec of this.codecs) {
            codec.decodePayload(parser);
        }
        return exports.Any.decodePayload(parser);
    }
    encodePayload(subject) {
        for (let codec of this.codecs) {
            codec.encodePayload(subject);
        }
        return exports.Any.encodePayload(subject);
    }
}
exports.IntersectionCodec = IntersectionCodec;
;
exports.Intersection = {
    of(...codecs) {
        return new IntersectionCodec(...codecs);
    }
};
class StringLiteralCodec extends Codec {
    value;
    constructor(value) {
        super();
        this.value = value;
    }
    decodePayload(parser) {
        let subject = exports.String.decodePayload(parser);
        if (subject !== this.value) {
            throw `Expected "${this.value}"!`;
        }
        return this.value;
    }
    encodePayload(subject) {
        if (subject !== this.value) {
            throw `Expected "${this.value}"!`;
        }
        return exports.String.encodePayload(subject);
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
    decodePayload(parser) {
        let subject = exports.Number.decodePayload(parser);
        if (subject !== this.value) {
            throw `Expected ${this.value}!`;
        }
        return this.value;
    }
    encodePayload(subject) {
        if (subject !== this.value) {
            throw `Expected ${this.value}!`;
        }
        return exports.Number.encodePayload(subject);
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
    decodePayload(parser) {
        let subject = exports.BigInt.decodePayload(parser);
        if (subject !== this.value) {
            throw `Expected ${this.value}!`;
        }
        return this.value;
    }
    encodePayload(subject) {
        if (subject !== this.value) {
            throw `Expected ${this.value}!`;
        }
        return exports.BigInt.encodePayload(subject);
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
    decodePayload(parser) {
        let subject = exports.Boolean.decodePayload(parser);
        if (subject !== this.value) {
            throw `Expected ${this.value}!`;
        }
        return this.value;
    }
    encodePayload(subject) {
        if (subject !== this.value) {
            throw `Expected ${this.value}!`;
        }
        return exports.Boolean.encodePayload(subject);
    }
}
exports.BooleanLiteralCodec = BooleanLiteralCodec;
;
exports.BooleanLiteral = {
    of(value) {
        return new BooleanLiteralCodec(value);
    }
};
