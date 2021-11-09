"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codecs = require("./codecs");
const utils = require("./utils");
function test(name, cb) {
    cb().catch((error) => {
        console.log(name);
        console.log(String(error));
    });
}
function arrayEquals(one, two) {
    if (one.length !== two.length) {
        return false;
    }
    for (let i = 0; i < one.length; i++) {
        if (one[i] !== two[i]) {
            return false;
        }
    }
    return true;
}
function recordEquals(one, two) {
    for (let key in one) {
        if (!(key in two)) {
            return false;
        }
    }
    for (let key in two) {
        if (!(key in one)) {
            return false;
        }
    }
    for (let key in one) {
        if (one[key] !== two[key]) {
            return false;
        }
    }
    return true;
}
(() => {
    test(`It should encode null properly.`, async () => {
        let observed = codecs.Null.encode(null);
        let expected = Uint8Array.of(0x01, 0x00);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode null properly.`, async () => {
        let observed = codecs.Null.decode(Uint8Array.of(0x01, 0x00));
        let expected = null;
        console.assert(observed === expected);
    });
})();
(() => {
    test(`It should encode false properly.`, async () => {
        let observed = codecs.False.encode(false);
        let expected = Uint8Array.of(0x01, 0x01);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode false properly.`, async () => {
        let observed = codecs.False.decode(Uint8Array.of(0x01, 0x01));
        let expected = false;
        console.assert(observed === expected);
    });
})();
(() => {
    test(`It should encode true properly.`, async () => {
        let observed = codecs.True.encode(true);
        let expected = Uint8Array.of(0x01, 0x02);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode true properly.`, async () => {
        let observed = codecs.True.decode(Uint8Array.of(0x01, 0x02));
        let expected = true;
        console.assert(observed === expected);
    });
})();
(() => {
    test(`It should encode number -1 properly.`, async () => {
        let observed = codecs.Number.encode(-1);
        let expected = Uint8Array.of(0x09, 0x03, 0x40, 0x0F, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode number -1 properly.`, async () => {
        let observed = codecs.Number.decode(Uint8Array.of(0x09, 0x03, 0x40, 0x0F, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF));
        let expected = -1;
        console.assert(observed === expected);
    });
    test(`It should encode number 0 properly.`, async () => {
        let observed = codecs.Number.encode(0);
        let expected = Uint8Array.of(0x09, 0x03, 0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode number 0 properly.`, async () => {
        let observed = codecs.Number.decode(Uint8Array.of(0x09, 0x03, 0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00));
        let expected = 0;
        console.assert(observed === expected);
    });
    test(`It should encode number 1 properly.`, async () => {
        let observed = codecs.Number.encode(1);
        let expected = Uint8Array.of(0x09, 0x03, 0xBF, 0xF0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode number 1 properly.`, async () => {
        let observed = codecs.Number.decode(Uint8Array.of(0x09, 0x03, 0xBF, 0xF0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00));
        let expected = 1;
        console.assert(observed === expected);
    });
    test(`It should maintain number sort order.`, async () => {
        let buffers = new Array();
        for (let i = 0; i < 1000; i++) {
            let number = 0xFFFFFFFF * (2.0 * Math.random() - 1.0) + Math.random();
            let buffer = codecs.Number.encodePayload(number);
            buffers.push(buffer);
        }
        buffers.sort(utils.Chunk.comparePrefixes);
        let last;
        for (let i = 0; i < buffers.length; i++) {
            let number = codecs.Number.decodePayload(buffers[i]);
            if (last != null) {
                console.assert(last <= number);
            }
            last = number;
        }
    });
})();
(() => {
    test(`It should encode string "" properly.`, async () => {
        let observed = codecs.String.encode("");
        let expected = Uint8Array.of(0x01, 0x04);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode string "" properly.`, async () => {
        let observed = codecs.String.decode(Uint8Array.of(0x01, 0x04));
        let expected = "";
        console.assert(observed === expected);
    });
    test(`It should encode string "\u{1F680}" properly.`, async () => {
        let observed = codecs.String.encode("\u{1F680}");
        let expected = Uint8Array.of(0x05, 0x04, 0xF0, 0x9F, 0x9A, 0x80);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode string "\u{1F680}" properly.`, async () => {
        let observed = codecs.String.decode(Uint8Array.of(0x05, 0x04, 0xF0, 0x9F, 0x9A, 0x80));
        let expected = "\u{1F680}";
        console.assert(observed === expected);
    });
})();
(() => {
    test(`It should encode binary [] properly.`, async () => {
        let observed = codecs.Binary.encode(Uint8Array.of());
        let expected = Uint8Array.of(0x01, 0x05);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode binary [] properly.`, async () => {
        let observed = codecs.Binary.decode(Uint8Array.of(0x01, 0x05));
        let expected = Uint8Array.of();
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should encode binary [0xFF] properly.`, async () => {
        let observed = codecs.Binary.encode(Uint8Array.of(0xFF));
        let expected = Uint8Array.of(0x02, 0x05, 0xFF);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode binary [0xFF] properly.`, async () => {
        let observed = codecs.Binary.decode(Uint8Array.of(0x02, 0x05, 0xFF));
        let expected = Uint8Array.of(0xFF);
        console.assert(utils.Chunk.equals(observed, expected));
    });
})();
(async () => {
    test(`It should encode bigint -65536 properly.`, async () => {
        let observed = codecs.BigInt.encode(-65536n);
        let expected = Uint8Array.of(0x04, 0x06, 0x7E, 0x00, 0x00);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode bigint -65536 properly.`, async () => {
        let observed = codecs.BigInt.decode(Uint8Array.of(0x04, 0x06, 0x7E, 0x00, 0x00));
        let expected = -65536n;
        console.assert(observed === expected);
    });
    test(`It should encode bigint -257 properly.`, async () => {
        let observed = codecs.BigInt.encode(-257n);
        let expected = Uint8Array.of(0x04, 0x06, 0x7E, 0xFE, 0xFF);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode bigint -257 properly.`, async () => {
        let observed = codecs.BigInt.decode(Uint8Array.of(0x04, 0x06, 0x7E, 0xFE, 0xFF));
        let expected = -257n;
        console.assert(observed === expected);
    });
    test(`It should encode bigint -256 properly.`, async () => {
        let observed = codecs.BigInt.encode(-256n);
        let expected = Uint8Array.of(0x03, 0x06, 0x7F, 0x00);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode bigint -256 properly.`, async () => {
        let observed = codecs.BigInt.decode(Uint8Array.of(0x03, 0x06, 0x7F, 0x00));
        let expected = -256n;
        console.assert(observed === expected);
    });
    test(`It should encode bigint -1 properly.`, async () => {
        let observed = codecs.BigInt.encode(-1n);
        let expected = Uint8Array.of(0x03, 0x06, 0x7F, 0xFF);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode bigint -1 properly.`, async () => {
        let observed = codecs.BigInt.decode(Uint8Array.of(0x03, 0x06, 0x7F, 0xFF));
        let expected = -1n;
        console.assert(observed === expected);
    });
    test(`It should encode bigint 0 properly.`, async () => {
        let observed = codecs.BigInt.encode(0n);
        let expected = Uint8Array.of(0x03, 0x06, 0x80, 0x00);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode bigint 0 properly.`, async () => {
        let observed = codecs.BigInt.decode(Uint8Array.of(0x03, 0x06, 0x80, 0x00));
        let expected = 0n;
        console.assert(observed === expected);
    });
    test(`It should encode bigint 255 properly.`, async () => {
        let observed = codecs.BigInt.encode(255n);
        let expected = Uint8Array.of(0x03, 0x06, 0x80, 0xFF);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode bigint 255 properly.`, async () => {
        let observed = codecs.BigInt.decode(Uint8Array.of(0x03, 0x06, 0x80, 0xFF));
        let expected = 255n;
        console.assert(observed === expected);
    });
    test(`It should encode bigint 256 properly.`, async () => {
        let observed = codecs.BigInt.encode(256n);
        let expected = Uint8Array.of(0x04, 0x06, 0x81, 0x01, 0x00);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode bigint 256 properly.`, async () => {
        let observed = codecs.BigInt.decode(Uint8Array.of(0x04, 0x06, 0x81, 0x01, 0x00));
        let expected = 256n;
        console.assert(observed === expected);
    });
    test(`It should encode bigint 65535 properly.`, async () => {
        let observed = codecs.BigInt.encode(65535n);
        let expected = Uint8Array.of(0x04, 0x06, 0x81, 0xFF, 0xFF);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode bigint 65535 properly.`, async () => {
        let observed = codecs.BigInt.decode(Uint8Array.of(0x04, 0x06, 0x81, 0xFF, 0xFF));
        let expected = 65535n;
        console.assert(observed === expected);
    });
    test(`It should maintain bigint sort order.`, async () => {
        let buffers = new Array();
        for (let i = 0; i < 1000; i++) {
            let hex = "0x";
            for (let i = 0; i < 128; i++) {
                hex += Math.floor(256 * Math.random()).toString(16).padStart(2, "0");
            }
            let number = -(2n ** 1024n) + 2n * BigInt(hex);
            let buffer = codecs.BigInt.encodePayload(number);
            buffers.push(buffer);
        }
        buffers.sort(utils.Chunk.comparePrefixes);
        let last;
        for (let i = 0; i < buffers.length; i++) {
            let number = codecs.BigInt.decodePayload(buffers[i]);
            if (last != null) {
                console.assert(last <= number);
            }
            last = number;
        }
    });
})();
(() => {
    test(`It should encode list [] properly.`, async () => {
        let observed = codecs.List.encode([]);
        let expected = Uint8Array.of(0x01, 0x07);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode list [] properly.`, async () => {
        let observed = codecs.List.decode(Uint8Array.of(0x01, 0x07));
        let expected = [];
        console.assert(arrayEquals(observed, expected));
    });
    test(`It should encode list ["one"] properly.`, async () => {
        let observed = codecs.List.encode(["one"]);
        let expected = Uint8Array.of(0x06, 0x07, 0x04, 0x04, 0x6F, 0x6E, 0x65);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode list ["one"] properly.`, async () => {
        let observed = codecs.List.decode(Uint8Array.of(0x06, 0x07, 0x04, 0x04, 0x6F, 0x6E, 0x65));
        let expected = ["one"];
        console.assert(arrayEquals(observed, expected));
    });
    test(`It should encode list ["one", "two"] properly.`, async () => {
        let observed = codecs.List.encode(["one", "two"]);
        let expected = Uint8Array.of(0x0B, 0x07, 0x04, 0x04, 0x6F, 0x6E, 0x65, 0x04, 0x04, 0x74, 0x77, 0x6F);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode list ["one", "two"] properly.`, async () => {
        let observed = codecs.List.decode(Uint8Array.of(0x0B, 0x07, 0x04, 0x04, 0x6F, 0x6E, 0x65, 0x04, 0x04, 0x74, 0x77, 0x6F));
        let expected = ["one", "two"];
        console.assert(arrayEquals(observed, expected));
    });
})();
(() => {
    test(`It should encode map {} properly.`, async () => {
        let observed = codecs.Map.encode({});
        let expected = Uint8Array.of(0x01, 0x08);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode map {} properly.`, async () => {
        let observed = codecs.Map.decode(Uint8Array.of(0x01, 0x08));
        let expected = {};
        console.assert(recordEquals(observed, expected));
    });
    test(`It should encode map { key1: "one" } properly.`, async () => {
        let observed = codecs.Map.encode({ key1: "one" });
        let expected = Uint8Array.of(0x0C, 0x08, 0x05, 0x04, 0x6B, 0x65, 0x79, 0x31, 0x04, 0x04, 0x6F, 0x6E, 0x65);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode map { key1: "one" } properly.`, async () => {
        let observed = codecs.Map.decode(Uint8Array.of(0x0C, 0x08, 0x05, 0x04, 0x6B, 0x65, 0x79, 0x31, 0x04, 0x04, 0x6F, 0x6E, 0x65));
        let expected = { key1: "one" };
        console.assert(recordEquals(observed, expected));
    });
    test(`It should encode map { key1: "one", key2: "two" } properly.`, async () => {
        let observed = codecs.Map.encode({ key1: "one", key2: "two" });
        let expected = Uint8Array.of(0x17, 0x08, 0x05, 0x04, 0x6B, 0x65, 0x79, 0x31, 0x04, 0x04, 0x6F, 0x6E, 0x65, 0x05, 0x04, 0x6B, 0x65, 0x79, 0x32, 0x04, 0x04, 0x74, 0x77, 0x6F);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode map { key1: "one", key2: "two" } properly.`, async () => {
        let observed = codecs.Map.decode(Uint8Array.of(0x17, 0x08, 0x05, 0x04, 0x6B, 0x65, 0x79, 0x31, 0x04, 0x04, 0x6F, 0x6E, 0x65, 0x05, 0x04, 0x6B, 0x65, 0x79, 0x32, 0x04, 0x04, 0x74, 0x77, 0x6F));
        let expected = { key1: "one", key2: "two" };
        console.assert(recordEquals(observed, expected));
    });
    test(`It should encode map { key2: "two", key1: "one" } properly.`, async () => {
        let observed = codecs.Map.encode({ key2: "two", key1: "one" });
        let expected = Uint8Array.of(0x17, 0x08, 0x05, 0x04, 0x6B, 0x65, 0x79, 0x31, 0x04, 0x04, 0x6F, 0x6E, 0x65, 0x05, 0x04, 0x6B, 0x65, 0x79, 0x32, 0x04, 0x04, 0x74, 0x77, 0x6F);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode map { key2: "two", key1: "one" } properly.`, async () => {
        let observed = codecs.Map.decode(Uint8Array.of(0x17, 0x08, 0x05, 0x04, 0x6B, 0x65, 0x79, 0x32, 0x04, 0x04, 0x74, 0x77, 0x6F, 0x05, 0x04, 0x6B, 0x65, 0x79, 0x31, 0x04, 0x04, 0x6F, 0x6E, 0x65));
        let expected = { key2: "two", key1: "one" };
        console.assert(recordEquals(observed, expected));
    });
})();
(() => {
    test(`It should encode boolean false properly.`, async () => {
        let observed = codecs.Boolean.encode(false);
        let expected = Uint8Array.of(0x01, 0x01);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode boolean false properly.`, async () => {
        let observed = codecs.Boolean.decode(Uint8Array.of(0x01, 0x01));
        let expected = false;
        console.assert(observed === expected);
    });
})();
(() => {
    test(`It should encode boolean true properly.`, async () => {
        let observed = codecs.Boolean.encode(true);
        let expected = Uint8Array.of(0x01, 0x02);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode boolean true properly.`, async () => {
        let observed = codecs.Boolean.decode(Uint8Array.of(0x01, 0x02));
        let expected = true;
        console.assert(observed === expected);
    });
})();
(() => {
    test(`It should encode [] as array<string> properly.`, async () => {
        let codec = codecs.Array.of(codecs.String);
        let observed = codec.encode([]);
        let expected = Uint8Array.of(0x01, 0x07);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode [] as array<string> properly.`, async () => {
        let codec = codecs.Array.of(codecs.String);
        let observed = codec.decode(Uint8Array.of(0x01, 0x07));
        let expected = [];
        console.assert(arrayEquals(observed, expected));
    });
    test(`It should encode ["one"] as array<string> properly.`, async () => {
        let codec = codecs.Array.of(codecs.String);
        let observed = codec.encode(["one"]);
        let expected = Uint8Array.of(0x06, 0x07, 0x04, 0x04, 0x6F, 0x6E, 0x65);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode ["one"] as array<string> properly.`, async () => {
        let codec = codecs.Array.of(codecs.String);
        let observed = codec.decode(Uint8Array.of(0x06, 0x07, 0x04, 0x04, 0x6F, 0x6E, 0x65));
        let expected = ["one"];
        console.assert(arrayEquals(observed, expected));
    });
    test(`It should encode ["one", "two"] as array<string> properly.`, async () => {
        let codec = codecs.Array.of(codecs.String);
        let observed = codec.encode(["one", "two"]);
        let expected = Uint8Array.of(0x0B, 0x07, 0x04, 0x04, 0x6F, 0x6E, 0x65, 0x04, 0x04, 0x74, 0x77, 0x6F);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode ["one", "two"] as array<string> properly.`, async () => {
        let codec = codecs.Array.of(codecs.String);
        let observed = codec.decode(Uint8Array.of(0x0B, 0x07, 0x04, 0x04, 0x6F, 0x6E, 0x65, 0x04, 0x04, 0x74, 0x77, 0x6F));
        let expected = ["one", "two"];
        console.assert(arrayEquals(observed, expected));
    });
})();
(() => {
    test(`It should encode {} as record<string> properly.`, async () => {
        let codec = codecs.Record.of(codecs.String);
        let observed = codec.encode({});
        let expected = Uint8Array.of(0x01, 0x08);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode {} as record<string> properly.`, async () => {
        let codec = codecs.Record.of(codecs.String);
        let observed = codec.decode(Uint8Array.of(0x01, 0x08));
        let expected = {};
        console.assert(recordEquals(observed, expected));
    });
    test(`It should encode { key1: "one" } as record<string> properly.`, async () => {
        let codec = codecs.Record.of(codecs.String);
        let observed = codec.encode({ key1: "one" });
        let expected = Uint8Array.of(0x0C, 0x08, 0x05, 0x04, 0x6B, 0x65, 0x79, 0x31, 0x04, 0x04, 0x6F, 0x6E, 0x65);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode { key1: "one" } as record<string> properly.`, async () => {
        let codec = codecs.Record.of(codecs.String);
        let observed = codec.decode(Uint8Array.of(0x0C, 0x08, 0x05, 0x04, 0x6B, 0x65, 0x79, 0x31, 0x04, 0x04, 0x6F, 0x6E, 0x65));
        let expected = { key1: "one" };
        console.assert(recordEquals(observed, expected));
    });
    test(`It should encode { key1: "one", key2: "two" } as record<string> properly.`, async () => {
        let codec = codecs.Record.of(codecs.String);
        let observed = codec.encode({ key1: "one", key2: "two" });
        let expected = Uint8Array.of(0x17, 0x08, 0x05, 0x04, 0x6B, 0x65, 0x79, 0x31, 0x04, 0x04, 0x6F, 0x6E, 0x65, 0x05, 0x04, 0x6B, 0x65, 0x79, 0x32, 0x04, 0x04, 0x74, 0x77, 0x6F);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode { key1: "one", key2: "two" } as record<string> properly.`, async () => {
        let codec = codecs.Record.of(codecs.String);
        let observed = codec.decode(Uint8Array.of(0x17, 0x08, 0x05, 0x04, 0x6B, 0x65, 0x79, 0x31, 0x04, 0x04, 0x6F, 0x6E, 0x65, 0x05, 0x04, 0x6B, 0x65, 0x79, 0x32, 0x04, 0x04, 0x74, 0x77, 0x6F));
        let expected = { key1: "one", key2: "two" };
        console.assert(recordEquals(observed, expected));
    });
    test(`It should encode { key2: "two", key1: "one" } as record<string> properly.`, async () => {
        let codec = codecs.Record.of(codecs.String);
        let observed = codec.encode({ key2: "two", key1: "one" });
        let expected = Uint8Array.of(0x17, 0x08, 0x05, 0x04, 0x6B, 0x65, 0x79, 0x31, 0x04, 0x04, 0x6F, 0x6E, 0x65, 0x05, 0x04, 0x6B, 0x65, 0x79, 0x32, 0x04, 0x04, 0x74, 0x77, 0x6F);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode { key2: "two", key1: "one" } as record<string> properly.`, async () => {
        let codec = codecs.Record.of(codecs.String);
        let observed = codec.decode(Uint8Array.of(0x17, 0x08, 0x05, 0x04, 0x6B, 0x65, 0x79, 0x32, 0x04, 0x04, 0x74, 0x77, 0x6F, 0x05, 0x04, 0x6B, 0x65, 0x79, 0x31, 0x04, 0x04, 0x6F, 0x6E, 0x65));
        let expected = { key2: "two", key1: "one" };
        console.assert(recordEquals(observed, expected));
    });
})();
(() => {
    test(`It should encode [] as tuple<> properly.`, async () => {
        let codec = codecs.Tuple.of();
        let observed = codec.encode([]);
        let expected = Uint8Array.of(0x01, 0x07);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode [] as tuple<> properly.`, async () => {
        let codec = codecs.Tuple.of();
        let observed = codec.decode(Uint8Array.of(0x01, 0x07));
        let expected = [];
        console.assert(arrayEquals(observed, expected));
    });
    test(`It should encode ["one"] as tuple<string> properly.`, async () => {
        let codec = codecs.Tuple.of(codecs.String);
        let observed = codec.encode(["one"]);
        let expected = Uint8Array.of(0x06, 0x07, 0x04, 0x04, 0x6F, 0x6E, 0x65);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode ["one"] as tuple<string> properly.`, async () => {
        let codec = codecs.Tuple.of(codecs.String);
        let observed = codec.decode(Uint8Array.of(0x06, 0x07, 0x04, 0x04, 0x6F, 0x6E, 0x65));
        let expected = ["one"];
        console.assert(arrayEquals(observed, expected));
    });
    test(`It should encode ["one", 0n] as tuple<string, bigint> properly.`, async () => {
        let codec = codecs.Tuple.of(codecs.String, codecs.BigInt);
        let observed = codec.encode(["one", 0n]);
        let expected = Uint8Array.of(0x0A, 0x07, 0x04, 0x04, 0x6F, 0x6E, 0x65, 0x03, 0x06, 0x80, 0x00);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode ["one", 0n] as tuple<string, bigint> properly.`, async () => {
        let codec = codecs.Tuple.of(codecs.String, codecs.BigInt);
        let observed = codec.decode(Uint8Array.of(0x0A, 0x07, 0x04, 0x04, 0x6F, 0x6E, 0x65, 0x03, 0x06, 0x80, 0x00));
        let expected = ["one", 0n];
        console.assert(arrayEquals(observed, expected));
    });
    test(`It should encode ["one", 0n, false] as tuple<string, bigint> properly.`, async () => {
        let codec = codecs.Tuple.of(codecs.String, codecs.BigInt);
        let observed = codec.encode(["one", 0n, false]);
        let expected = Uint8Array.of(0x0C, 0x07, 0x04, 0x04, 0x6F, 0x6E, 0x65, 0x03, 0x06, 0x80, 0x00, 0x01, 0x01);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode ["one", 0n, false] as tuple<string, bigint> properly.`, async () => {
        let codec = codecs.Tuple.of(codecs.String, codecs.BigInt);
        let observed = codec.decode(Uint8Array.of(0x0C, 0x07, 0x04, 0x04, 0x6F, 0x6E, 0x65, 0x03, 0x06, 0x80, 0x00, 0x01, 0x01));
        let expected = ["one", 0n, false];
        console.assert(arrayEquals(observed, expected));
    });
})();
(() => {
    test(`It should encode {} as object<{}> properly.`, async () => {
        let codec = codecs.Object.of({});
        let observed = codec.encode({});
        let expected = Uint8Array.of(0x01, 0x08);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode {} as object<{}> properly.`, async () => {
        let codec = codecs.Object.of({});
        let observed = codec.decode(Uint8Array.of(0x01, 0x08));
        let expected = {};
        console.assert(recordEquals(observed, expected));
    });
    test(`It should encode { key1: "a" } as object<{ key1: string }> properly.`, async () => {
        let codec = codecs.Object.of({
            key1: codecs.String
        });
        let observed = codec.encode({
            key1: "a"
        });
        let expected = Uint8Array.of(0x0A, 0x08, 0x05, 0x04, 0x6B, 0x65, 0x79, 0x31, 0x02, 0x04, 0x61);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode { key1: "a" } as object<{ key1: string }> properly.`, async () => {
        let codec = codecs.Object.of({
            key1: codecs.String
        });
        let observed = codec.decode(Uint8Array.of(0x0A, 0x08, 0x05, 0x04, 0x6B, 0x65, 0x79, 0x31, 0x02, 0x04, 0x61));
        let expected = {
            key1: "a"
        };
        console.assert(recordEquals(observed, expected));
    });
    test(`It should encode { key1: "a", key2: "b } as object<{ key1: string, key2: string }> properly.`, async () => {
        let codec = codecs.Object.of({
            key1: codecs.String,
            key2: codecs.String
        });
        let observed = codec.encode({
            key1: "a",
            key2: "b"
        });
        let expected = Uint8Array.of(0x13, 0x08, 0x05, 0x04, 0x6B, 0x65, 0x79, 0x31, 0x02, 0x04, 0x61, 0x05, 0x04, 0x6B, 0x65, 0x79, 0x32, 0x02, 0x04, 0x62);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode { key1: "a", key2: "b } as object<{ key1: string, key2: string }> properly.`, async () => {
        let codec = codecs.Object.of({
            key1: codecs.String,
            key2: codecs.String
        });
        let observed = codec.decode(Uint8Array.of(0x13, 0x08, 0x05, 0x04, 0x6B, 0x65, 0x79, 0x31, 0x02, 0x04, 0x61, 0x05, 0x04, 0x6B, 0x65, 0x79, 0x32, 0x02, 0x04, 0x62));
        let expected = {
            key1: "a",
            key2: "b"
        };
        console.assert(recordEquals(observed, expected));
    });
    test(`It should encode { key1: "a" } as object<{}> properly.`, async () => {
        let codec = codecs.Object.of({});
        let observed = codec.encode({
            key1: "a"
        });
        let expected = Uint8Array.of(0x0A, 0x08, 0x05, 0x04, 0x6B, 0x65, 0x79, 0x31, 0x02, 0x04, 0x61);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode { key1: "a" } as object<{}> properly.`, async () => {
        let codec = codecs.Object.of({});
        let observed = codec.decode(Uint8Array.of(0x0A, 0x08, 0x05, 0x04, 0x6B, 0x65, 0x79, 0x31, 0x02, 0x04, 0x61, 0x62));
        let expected = {
            key1: "a"
        };
        console.assert(recordEquals(observed, expected));
    });
})();
(() => {
    test(`It should encode "one" as union<string> properly.`, async () => {
        let codec = codecs.Union.of(codecs.String);
        let observed = codec.encode("one");
        let expected = Uint8Array.of(0x04, 0x04, 0x6F, 0x6E, 0x65);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode "one" as union<string> properly.`, async () => {
        let codec = codecs.Union.of(codecs.String);
        let observed = codec.decode(Uint8Array.of(0x04, 0x04, 0x6F, 0x6E, 0x65));
        let expected = "one";
        console.assert(observed === expected);
    });
    test(`It should encode "one" as union<string, null> properly.`, async () => {
        let codec = codecs.Union.of(codecs.String, codecs.Null);
        let observed = codec.encode("one");
        let expected = Uint8Array.of(0x04, 0x04, 0x6F, 0x6E, 0x65);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode "one" as union<string, null> properly.`, async () => {
        let codec = codecs.Union.of(codecs.String, codecs.Null);
        let observed = codec.decode(Uint8Array.of(0x04, 0x04, 0x6F, 0x6E, 0x65));
        let expected = "one";
        console.assert(observed === expected);
    });
    test(`It should encode null as union<string, null> properly.`, async () => {
        let codec = codecs.Union.of(codecs.String, codecs.Null);
        let observed = codec.encode(null);
        let expected = Uint8Array.of(0x01, 0x00);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode null as union<string, null> properly.`, async () => {
        let codec = codecs.Union.of(codecs.String, codecs.Null);
        let observed = codec.decode(Uint8Array.of(0x01, 0x00));
        let expected = null;
        console.assert(observed === expected);
    });
    test(`It should encode "one" as union<null, string> properly.`, async () => {
        let codec = codecs.Union.of(codecs.Null, codecs.String);
        let observed = codec.encode("one");
        let expected = Uint8Array.of(0x04, 0x04, 0x6F, 0x6E, 0x65);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode "one" as union<null, string> properly.`, async () => {
        let codec = codecs.Union.of(codecs.Null, codecs.String);
        let observed = codec.decode(Uint8Array.of(0x04, 0x04, 0x6F, 0x6E, 0x65));
        let expected = "one";
        console.assert(observed === expected);
    });
    test(`It should encode null as union<null, string> properly.`, async () => {
        let codec = codecs.Union.of(codecs.Null, codecs.String);
        let observed = codec.encode(null);
        let expected = Uint8Array.of(0x01, 0x00);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode null as union<null, string> properly.`, async () => {
        let codec = codecs.Union.of(codecs.Null, codecs.String);
        let observed = codec.decode(Uint8Array.of(0x01, 0x00));
        let expected = null;
        console.assert(observed === expected);
    });
})();
