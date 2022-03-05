"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils = require("./utils");
function test(name, cb) {
    cb().catch((error) => {
        console.log(name);
        console.log(String(error));
    });
}
(async () => {
    test(`It should parse unsigned 1-byte big endian properly.`, async () => {
        let parser = new utils.Parser(Uint8Array.of(1, 2, 3, 4, 5, 6));
        let observed = parser.unsigned(1, "big");
        let expected = 0x01;
        console.assert(observed === expected);
    });
    test(`It should parse unsigned 2-byte big endian properly.`, async () => {
        let parser = new utils.Parser(Uint8Array.of(1, 2, 3, 4, 5, 6));
        let observed = parser.unsigned(2, "big");
        let expected = 0x0102;
        console.assert(observed === expected);
    });
    test(`It should parse unsigned 3-byte big endian properly.`, async () => {
        let parser = new utils.Parser(Uint8Array.of(1, 2, 3, 4, 5, 6));
        let observed = parser.unsigned(3, "big");
        let expected = 0x010203;
        console.assert(observed === expected);
    });
    test(`It should parse unsigned 4-byte big endian properly.`, async () => {
        let parser = new utils.Parser(Uint8Array.of(1, 2, 3, 4, 5, 6));
        let observed = parser.unsigned(4, "big");
        let expected = 0x01020304;
        console.assert(observed === expected);
    });
    test(`It should parse unsigned 5-byte big endian properly.`, async () => {
        let parser = new utils.Parser(Uint8Array.of(1, 2, 3, 4, 5, 6));
        let observed = parser.unsigned(5, "big");
        let expected = 0x0102030405;
        console.assert(observed === expected);
    });
    test(`It should parse unsigned 6-byte big endian properly.`, async () => {
        let parser = new utils.Parser(Uint8Array.of(1, 2, 3, 4, 5, 6));
        let observed = parser.unsigned(6, "big");
        let expected = 0x010203040506;
        console.assert(observed === expected);
    });
    test(`It should parse unsigned 1-byte little endian properly.`, async () => {
        let parser = new utils.Parser(Uint8Array.of(1, 2, 3, 4, 5, 6));
        let observed = parser.unsigned(1, "little");
        let expected = 0x01;
        console.assert(observed === expected);
    });
    test(`It should parse unsigned 2-byte little endian properly.`, async () => {
        let parser = new utils.Parser(Uint8Array.of(1, 2, 3, 4, 5, 6));
        let observed = parser.unsigned(2, "little");
        let expected = 0x0201;
        console.assert(observed === expected);
    });
    test(`It should parse unsigned 3-byte little endian properly.`, async () => {
        let parser = new utils.Parser(Uint8Array.of(1, 2, 3, 4, 5, 6));
        let observed = parser.unsigned(3, "little");
        let expected = 0x030201;
        console.assert(observed === expected);
    });
    test(`It should parse unsigned 4-byte little endian properly.`, async () => {
        let parser = new utils.Parser(Uint8Array.of(1, 2, 3, 4, 5, 6));
        let observed = parser.unsigned(4, "little");
        let expected = 0x04030201;
        console.assert(observed === expected);
    });
    test(`It should parse unsigned 5-byte little endian properly.`, async () => {
        let parser = new utils.Parser(Uint8Array.of(1, 2, 3, 4, 5, 6));
        let observed = parser.unsigned(5, "little");
        let expected = 0x0504030201;
        console.assert(observed === expected);
    });
    test(`It should parse unsigned 6-byte little endian properly.`, async () => {
        let parser = new utils.Parser(Uint8Array.of(1, 2, 3, 4, 5, 6));
        let observed = parser.unsigned(6, "little");
        let expected = 0x060504030201;
        console.assert(observed === expected);
    });
})();
(async () => {
    test(`It should convert chunks to strings "binary" properly.`, async () => {
        let observed = utils.Chunk.toString(Uint8Array.of(0x00, 0x0F, 0xF0, 0xFF), "binary");
        let expected = "\x00\x0F\xF0\xFF";
        console.assert(observed === expected);
    });
    test(`It should convert strings to chunks "binary" properly.`, async () => {
        let observed = utils.Chunk.fromString("\x00\x0F\xF0\xFF", "binary");
        let expected = Uint8Array.of(0x00, 0x0F, 0xF0, 0xFF);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should convert chunks to strings "base64" properly.`, async () => {
        let observed = utils.Chunk.toString(Uint8Array.of(0x00, 0x0F, 0xF0, 0xFF), "base64");
        let expected = "AA/w/w==";
        console.assert(observed === expected);
    });
    test(`It should convert strings to chunks "base64" properly.`, async () => {
        let observed = utils.Chunk.fromString("AA/w/w==", "base64");
        let expected = Uint8Array.of(0x00, 0x0F, 0xF0, 0xFF);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should convert chunks to strings "base64url" properly.`, async () => {
        let observed = utils.Chunk.toString(Uint8Array.of(0x00, 0x0F, 0xF0, 0xFF), "base64url");
        let expected = "AA_w_w";
        console.assert(observed === expected);
    });
    test(`It should convert strings to chunks "base64url" properly.`, async () => {
        let observed = utils.Chunk.fromString("AA_w_w", "base64url");
        let expected = Uint8Array.of(0x00, 0x0F, 0xF0, 0xFF);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should convert chunks to strings "hex" properly.`, async () => {
        let observed = utils.Chunk.toString(Uint8Array.of(0x00, 0x0F, 0xF0, 0xFF), "hex");
        let expected = "000FF0FF";
        console.assert(observed === expected);
    });
    test(`It should convert strings to chunks "hex" properly.`, async () => {
        let observed = utils.Chunk.fromString("000FF0FF", "hex");
        let expected = Uint8Array.of(0x00, 0x0F, 0xF0, 0xFF);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should convert chunks to strings "utf-8" properly.`, async () => {
        let observed = utils.Chunk.toString(Uint8Array.of(0xF0, 0x9F, 0x9A, 0x80), "utf-8");
        let expected = "\u{1F680}";
        console.assert(observed === expected);
    });
    test(`It should convert strings to chunks "utf-8" properly.`, async () => {
        let observed = utils.Chunk.fromString("\u{1F680}", "utf-8");
        let expected = Uint8Array.of(0xF0, 0x9F, 0x9A, 0x80);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should determine equality for chunks [0], [0] properly.`, async () => {
        let observed = utils.Chunk.equals(Uint8Array.of(0), Uint8Array.of(0));
        let expected = true;
        console.assert(observed === expected);
    });
    test(`It should determine equality for chunks [0], [1] properly.`, async () => {
        let observed = utils.Chunk.equals(Uint8Array.of(0), Uint8Array.of(1));
        let expected = false;
        console.assert(observed === expected);
    });
    test(`It should compare chunks ([0] < [0,1]).`, async () => {
        let observed = utils.Chunk.comparePrefixes(Uint8Array.of(0), Uint8Array.of(0, 1));
        let expected = -1;
        console.assert(observed === expected);
    });
    test(`It should compare chunks ([1] > [0,1]).`, async () => {
        let observed = utils.Chunk.comparePrefixes(Uint8Array.of(1), Uint8Array.of(0, 1));
        let expected = 1;
        console.assert(observed === expected);
    });
    test(`It should compare chunks ([2] > [0,1]).`, async () => {
        let observed = utils.Chunk.comparePrefixes(Uint8Array.of(2), Uint8Array.of(0, 1));
        let expected = 1;
        console.assert(observed === expected);
    });
    test(`It should compare chunks ([0] < [1,1]).`, async () => {
        let observed = utils.Chunk.comparePrefixes(Uint8Array.of(0), Uint8Array.of(1, 1));
        let expected = -1;
        console.assert(observed === expected);
    });
    test(`It should compare chunks ([1] < [1,1]).`, async () => {
        let observed = utils.Chunk.comparePrefixes(Uint8Array.of(1), Uint8Array.of(1, 1));
        let expected = -1;
        console.assert(observed === expected);
    });
    test(`It should compare chunks ([2] > [1,1]).`, async () => {
        let observed = utils.Chunk.comparePrefixes(Uint8Array.of(2), Uint8Array.of(1, 1));
        let expected = 1;
        console.assert(observed === expected);
    });
    test(`It should compare chunks ([0] < [2,1]).`, async () => {
        let observed = utils.Chunk.comparePrefixes(Uint8Array.of(0), Uint8Array.of(2, 1));
        let expected = -1;
        console.assert(observed === expected);
    });
    test(`It should compare chunks ([1] < [2,1]).`, async () => {
        let observed = utils.Chunk.comparePrefixes(Uint8Array.of(1), Uint8Array.of(2, 1));
        let expected = -1;
        console.assert(observed === expected);
    });
    test(`It should compare chunks ([2] < [2,1]).`, async () => {
        let observed = utils.Chunk.comparePrefixes(Uint8Array.of(2), Uint8Array.of(2, 1));
        let expected = -1;
        console.assert(observed === expected);
    });
    test(`It should compare chunks ([0,0] < [0,1]).`, async () => {
        let observed = utils.Chunk.comparePrefixes(Uint8Array.of(0, 0), Uint8Array.of(0, 1));
        let expected = -1;
        console.assert(observed === expected);
    });
    test(`It should compare chunks ([0,1] = [0,1]).`, async () => {
        let observed = utils.Chunk.comparePrefixes(Uint8Array.of(0, 1), Uint8Array.of(0, 1));
        let expected = 0;
        console.assert(observed === expected);
    });
    test(`It should compare chunks ([0,2] > [0,1]).`, async () => {
        let observed = utils.Chunk.comparePrefixes(Uint8Array.of(0, 2), Uint8Array.of(0, 1));
        let expected = 1;
        console.assert(observed === expected);
    });
    test(`It should compare chunks ([0,0] < [1,1]).`, async () => {
        let observed = utils.Chunk.comparePrefixes(Uint8Array.of(0, 0), Uint8Array.of(1, 1));
        let expected = -1;
        console.assert(observed === expected);
    });
    test(`It should compare chunks ([0,1] < [1,1]).`, async () => {
        let observed = utils.Chunk.comparePrefixes(Uint8Array.of(0, 1), Uint8Array.of(1, 1));
        let expected = -1;
        console.assert(observed === expected);
    });
    test(`It should compare chunks ([0,2] < [1,1]).`, async () => {
        let observed = utils.Chunk.comparePrefixes(Uint8Array.of(0, 2), Uint8Array.of(1, 1));
        let expected = -1;
        console.assert(observed === expected);
    });
    test(`It should compare chunks ([0,0] < [2,1]).`, async () => {
        let observed = utils.Chunk.comparePrefixes(Uint8Array.of(0, 0), Uint8Array.of(2, 1));
        let expected = -1;
        console.assert(observed === expected);
    });
    test(`It should compare chunks ([0,1] < [2,1]).`, async () => {
        let observed = utils.Chunk.comparePrefixes(Uint8Array.of(0, 1), Uint8Array.of(2, 1));
        let expected = -1;
        console.assert(observed === expected);
    });
    test(`It should compare chunks ([0,2] < [2,1]).`, async () => {
        let observed = utils.Chunk.comparePrefixes(Uint8Array.of(0, 2), Uint8Array.of(2, 1));
        let expected = -1;
        console.assert(observed === expected);
    });
    test(`It should compare chunks ([1,0] > [0,1]).`, async () => {
        let observed = utils.Chunk.comparePrefixes(Uint8Array.of(1, 0), Uint8Array.of(0, 1));
        let expected = 1;
        console.assert(observed === expected);
    });
    test(`It should compare chunks ([1,1] > [0,1]).`, async () => {
        let observed = utils.Chunk.comparePrefixes(Uint8Array.of(1, 1), Uint8Array.of(0, 1));
        let expected = 1;
        console.assert(observed === expected);
    });
    test(`It should compare chunks ([1,2] > [0,1]).`, async () => {
        let observed = utils.Chunk.comparePrefixes(Uint8Array.of(1, 2), Uint8Array.of(0, 1));
        let expected = 1;
        console.assert(observed === expected);
    });
    test(`It should compare chunks ([1,0] < [1,1]).`, async () => {
        let observed = utils.Chunk.comparePrefixes(Uint8Array.of(1, 0), Uint8Array.of(1, 1));
        let expected = -1;
        console.assert(observed === expected);
    });
    test(`It should compare chunks ([1,1] = [1,1]).`, async () => {
        let observed = utils.Chunk.comparePrefixes(Uint8Array.of(1, 1), Uint8Array.of(1, 1));
        let expected = 0;
        console.assert(observed === expected);
    });
    test(`It should compare chunks ([1,2] > [1,1]).`, async () => {
        let observed = utils.Chunk.comparePrefixes(Uint8Array.of(1, 2), Uint8Array.of(1, 1));
        let expected = 1;
        console.assert(observed === expected);
    });
    test(`It should compare chunks ([1,0] < [2,1]).`, async () => {
        let observed = utils.Chunk.comparePrefixes(Uint8Array.of(1, 0), Uint8Array.of(2, 1));
        let expected = -1;
        console.assert(observed === expected);
    });
    test(`It should compare chunks ([1,1] < [2,1]).`, async () => {
        let observed = utils.Chunk.comparePrefixes(Uint8Array.of(1, 1), Uint8Array.of(2, 1));
        let expected = -1;
        console.assert(observed === expected);
    });
    test(`It should compare chunks ([1,2] < [2,1]).`, async () => {
        let observed = utils.Chunk.comparePrefixes(Uint8Array.of(1, 2), Uint8Array.of(2, 1));
        let expected = -1;
        console.assert(observed === expected);
    });
    test(`It should compare chunks ([2,0] > [0,1]).`, async () => {
        let observed = utils.Chunk.comparePrefixes(Uint8Array.of(2, 0), Uint8Array.of(0, 1));
        let expected = 1;
        console.assert(observed === expected);
    });
    test(`It should compare chunks ([2,1] > [0,1]).`, async () => {
        let observed = utils.Chunk.comparePrefixes(Uint8Array.of(2, 1), Uint8Array.of(0, 1));
        let expected = 1;
        console.assert(observed === expected);
    });
    test(`It should compare chunks ([2,2] > [0,1]).`, async () => {
        let observed = utils.Chunk.comparePrefixes(Uint8Array.of(2, 2), Uint8Array.of(0, 1));
        let expected = 1;
        console.assert(observed === expected);
    });
    test(`It should compare chunks ([2,0] > [1,1]).`, async () => {
        let observed = utils.Chunk.comparePrefixes(Uint8Array.of(2, 0), Uint8Array.of(1, 1));
        let expected = 1;
        console.assert(observed === expected);
    });
    test(`It should compare chunks ([2,1] > [1,1]).`, async () => {
        let observed = utils.Chunk.comparePrefixes(Uint8Array.of(2, 1), Uint8Array.of(1, 1));
        let expected = 1;
        console.assert(observed === expected);
    });
    test(`It should compare chunks ([2,2] > [1,1]).`, async () => {
        let observed = utils.Chunk.comparePrefixes(Uint8Array.of(2, 2), Uint8Array.of(1, 1));
        let expected = 1;
        console.assert(observed === expected);
    });
    test(`It should compare chunks ([2,0] < [2,1]).`, async () => {
        let observed = utils.Chunk.comparePrefixes(Uint8Array.of(2, 0), Uint8Array.of(2, 1));
        let expected = -1;
        console.assert(observed === expected);
    });
    test(`It should compare chunks ([2,1] = [2,1]).`, async () => {
        let observed = utils.Chunk.comparePrefixes(Uint8Array.of(2, 1), Uint8Array.of(2, 1));
        let expected = 0;
        console.assert(observed === expected);
    });
    test(`It should compare chunks ([2,2] > [2,1]).`, async () => {
        let observed = utils.Chunk.comparePrefixes(Uint8Array.of(2, 2), Uint8Array.of(2, 1));
        let expected = 1;
        console.assert(observed === expected);
    });
    test(`It should compare chunks "bb" > "a" properly.`, async () => {
        let observed = utils.Chunk.comparePrefixes(utils.Chunk.fromString("bb", "binary"), utils.Chunk.fromString("a", "binary"));
        let expected = 1;
        console.assert(observed === expected);
    });
    test(`It should compare chunks "bb" < "c" properly.`, async () => {
        let observed = utils.Chunk.comparePrefixes(utils.Chunk.fromString("bb", "binary"), utils.Chunk.fromString("c", "binary"));
        let expected = -1;
        console.assert(observed === expected);
    });
    test(`It should compare chunks "a" < "bb" properly.`, async () => {
        let observed = utils.Chunk.comparePrefixes(utils.Chunk.fromString("a", "binary"), utils.Chunk.fromString("bb", "binary"));
        let expected = -1;
        console.assert(observed === expected);
    });
    test(`It should compare chunks "c" > "bb" properly.`, async () => {
        let observed = utils.Chunk.comparePrefixes(utils.Chunk.fromString("c", "binary"), utils.Chunk.fromString("bb", "binary"));
        let expected = 1;
        console.assert(observed === expected);
    });
    test(`It should compare chunks "ba" < "bb" properly.`, async () => {
        let observed = utils.Chunk.comparePrefixes(utils.Chunk.fromString("ba", "binary"), utils.Chunk.fromString("bb", "binary"));
        let expected = -1;
        console.assert(observed === expected);
    });
    test(`It should compare chunks "bc" > "bb" properly.`, async () => {
        let observed = utils.Chunk.comparePrefixes(utils.Chunk.fromString("bc", "binary"), utils.Chunk.fromString("bb", "binary"));
        let expected = 1;
        console.assert(observed === expected);
    });
    test(`It should concat chunks properly.`, async () => {
        let observed = utils.Chunk.concat([Uint8Array.of(1, 2), Uint8Array.of(3)]);
        let expected = Uint8Array.of(1, 2, 3);
        console.assert(utils.Chunk.equals(observed, expected));
    });
})();
(async () => {
    test(`It should encode VarCategory -128 properly.`, async () => {
        let observed = utils.VarCategory.encode(-128);
        let expected = Uint8Array.of(0b00_000000, 0b00_0000000, 0b01_111110);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode VarCategory -128 properly.`, async () => {
        let observed = utils.VarCategory.decode(Uint8Array.of(0b00_000000, 0b00_0000000, 0b01_111110));
        let expected = -128;
        console.assert(observed === expected);
    });
    test(`It should encode VarCategory -127 properly.`, async () => {
        let observed = utils.VarCategory.encode(-127);
        let expected = Uint8Array.of(0b00_0000000, 0b01_000000);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode VarCategory -127 properly.`, async () => {
        let observed = utils.VarCategory.decode(Uint8Array.of(0b00_0000000, 0b01_000000));
        let expected = -127;
        console.assert(observed === expected);
    });
    test(`It should encode VarCategory -65 properly.`, async () => {
        let observed = utils.VarCategory.encode(-65);
        let expected = Uint8Array.of(0b00_0000000, 0b01_111110);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode VarCategory -65 properly.`, async () => {
        let observed = utils.VarCategory.decode(Uint8Array.of(0b00_0000000, 0b01_111110));
        let expected = -65;
        console.assert(observed === expected);
    });
    test(`It should encode VarCategory -64 properly.`, async () => {
        let observed = utils.VarCategory.encode(-64);
        let expected = Uint8Array.of(0b01_000000);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode VarCategory -64 properly.`, async () => {
        let observed = utils.VarCategory.decode(Uint8Array.of(0b01_000000));
        let expected = -64;
        console.assert(observed === expected);
    });
    test(`It should encode VarCategory -1 properly.`, async () => {
        let observed = utils.VarCategory.encode(-1);
        let expected = Uint8Array.of(0b01_111111);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode VarCategory -1 properly.`, async () => {
        let observed = utils.VarCategory.decode(Uint8Array.of(0b01_111111));
        let expected = -1;
        console.assert(observed === expected);
    });
    test(`It should encode VarCategory 0 properly.`, async () => {
        let observed = utils.VarCategory.encode(0);
        let expected = Uint8Array.of(0b10_000000);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode VarCategory 0 properly.`, async () => {
        let observed = utils.VarCategory.decode(Uint8Array.of(0b10_000000));
        let expected = 0;
        console.assert(observed === expected);
    });
    test(`It should encode VarCategory 63 properly.`, async () => {
        let observed = utils.VarCategory.encode(63);
        let expected = Uint8Array.of(0b10_111111);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode VarCategory 63 properly.`, async () => {
        let observed = utils.VarCategory.decode(Uint8Array.of(0b10_111111));
        let expected = 63;
        console.assert(observed === expected);
    });
    test(`It should encode VarCategory 64 properly.`, async () => {
        let observed = utils.VarCategory.encode(64);
        let expected = Uint8Array.of(0b11_111111, 0b10_000001);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode VarCategory 64 properly.`, async () => {
        let observed = utils.VarCategory.decode(Uint8Array.of(0b11_111111, 0b10_000001));
        let expected = 64;
        console.assert(observed === expected);
    });
    test(`It should encode VarCategory 126 properly.`, async () => {
        let observed = utils.VarCategory.encode(126);
        let expected = Uint8Array.of(0b11_111111, 0b10_111111);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode VarCategory 126 properly.`, async () => {
        let observed = utils.VarCategory.decode(Uint8Array.of(0b11_111111, 0b10_111111));
        let expected = 126;
        console.assert(observed === expected);
    });
    test(`It should encode VarCategory 127 properly.`, async () => {
        let observed = utils.VarCategory.encode(127);
        let expected = Uint8Array.of(0b11_111111, 0b11_111111, 0b10_000001);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode VarCategory 127 properly.`, async () => {
        let observed = utils.VarCategory.decode(Uint8Array.of(0b11_111111, 0b11_111111, 0b10_000001));
        let expected = 127;
        console.assert(observed === expected);
    });
    test(`It should maintain VarCategory sort order.`, async () => {
        let buffers = new Array();
        for (let i = 0; i < 1000; i++) {
            let number = -505 + Math.floor(1010 * Math.random());
            let buffer = utils.VarCategory.encode(number);
            buffers.push(buffer);
        }
        buffers.sort(utils.Chunk.comparePrefixes);
        let last;
        for (let i = 0; i < buffers.length; i++) {
            let number = utils.VarCategory.decode(buffers[i]);
            if (last != null) {
                console.assert(last <= number);
            }
            last = number;
        }
    });
})();
(async () => {
    test(`It should encode VarInteger -4097 properly.`, async () => {
        let observed = utils.VarInteger.encode(-4097);
        let expected = Uint8Array.of(0b00_111110, 0b00_111111, 0b01_111111);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode VarInteger -4097 properly.`, async () => {
        let observed = utils.VarInteger.decode(Uint8Array.of(0b00_111110, 0b00_111111, 0b01_111111));
        let expected = -4097;
        console.assert(observed === expected);
    });
    test(`It should encode VarInteger -4096 properly.`, async () => {
        let observed = utils.VarInteger.encode(-4096);
        let expected = Uint8Array.of(0b00_000000, 0b01_000000);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode VarInteger -4096 properly.`, async () => {
        let observed = utils.VarInteger.decode(Uint8Array.of(0b00_000000, 0b01_000000));
        let expected = -4096;
        console.assert(observed === expected);
    });
    test(`It should encode VarInteger -65 properly.`, async () => {
        let observed = utils.VarInteger.encode(-65);
        let expected = Uint8Array.of(0b00_111110, 0b01_111111);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode VarInteger -65 properly.`, async () => {
        let observed = utils.VarInteger.decode(Uint8Array.of(0b00_111110, 0b01_111111));
        let expected = -65;
        console.assert(observed === expected);
    });
    test(`It should encode VarInteger -64 properly.`, async () => {
        let observed = utils.VarInteger.encode(-64);
        let expected = Uint8Array.of(0b01_000000);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode VarInteger -64 properly.`, async () => {
        let observed = utils.VarInteger.decode(Uint8Array.of(0b01_000000));
        let expected = -64;
        console.assert(observed === expected);
    });
    test(`It should encode VarInteger -1 properly.`, async () => {
        let observed = utils.VarInteger.encode(-1);
        let expected = Uint8Array.of(0b01_111111);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode VarInteger -1 properly.`, async () => {
        let observed = utils.VarInteger.decode(Uint8Array.of(0b01_111111));
        let expected = -1;
        console.assert(observed === expected);
    });
    test(`It should encode VarInteger 0 properly.`, async () => {
        let observed = utils.VarInteger.encode(0);
        let expected = Uint8Array.of(0b10_000000);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode VarInteger 0 properly.`, async () => {
        let observed = utils.VarInteger.decode(Uint8Array.of(0b10_000000));
        let expected = 0;
        console.assert(observed === expected);
    });
    test(`It should encode VarInteger 63 properly.`, async () => {
        let observed = utils.VarInteger.encode(63);
        let expected = Uint8Array.of(0b10_111111);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode VarInteger 63 properly.`, async () => {
        let observed = utils.VarInteger.decode(Uint8Array.of(0b10_111111));
        let expected = 63;
        console.assert(observed === expected);
    });
    test(`It should encode VarInteger 64 properly.`, async () => {
        let observed = utils.VarInteger.encode(64);
        let expected = Uint8Array.of(0b11_000001, 0b10_000000);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode VarInteger 64 properly.`, async () => {
        let observed = utils.VarInteger.decode(Uint8Array.of(0b11_000001, 0b10_000000));
        let expected = 64;
        console.assert(observed === expected);
    });
    test(`It should encode VarInteger 4095 properly.`, async () => {
        let observed = utils.VarInteger.encode(4095);
        let expected = Uint8Array.of(0b11_111111, 0b10_111111);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode VarInteger 4095 properly.`, async () => {
        let observed = utils.VarInteger.decode(Uint8Array.of(0b11_111111, 0b10_111111));
        let expected = 4095;
        console.assert(observed === expected);
    });
    test(`It should encode VarInteger 4096 properly.`, async () => {
        let observed = utils.VarInteger.encode(4096);
        let expected = Uint8Array.of(0b11_000001, 0b11_000000, 0b10_000000);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode VarInteger 4096 properly.`, async () => {
        let observed = utils.VarInteger.decode(Uint8Array.of(0b11_000001, 0b11_000000, 0b10_000000));
        let expected = 4096;
        console.assert(observed === expected);
    });
})();
(async () => {
    test(`It should encode VarLength 0 properly.`, async () => {
        let observed = utils.VarLength.encode(0);
        let expected = Uint8Array.of(0b0_0000000);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode VarLength 0 properly.`, async () => {
        let observed = utils.VarLength.decode(Uint8Array.of(0b0_0000000));
        let expected = 0;
        console.assert(observed === expected);
    });
    test(`It should encode VarLength 127 properly.`, async () => {
        let observed = utils.VarLength.encode(127);
        let expected = Uint8Array.of(0b0_1111111);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode VarLength 127 properly.`, async () => {
        let observed = utils.VarLength.decode(Uint8Array.of(0b0_1111111));
        let expected = 127;
        console.assert(observed === expected);
    });
    test(`It should encode VarLength 128 properly.`, async () => {
        let observed = utils.VarLength.encode(128);
        let expected = Uint8Array.of(0b1_0000001, 0b0_0000000);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode VarLength 128 properly.`, async () => {
        let observed = utils.VarLength.decode(Uint8Array.of(0b1_0000001, 0b0_0000000));
        let expected = 128;
        console.assert(observed === expected);
    });
    test(`It should encode VarLength 16383 properly.`, async () => {
        let observed = utils.VarLength.encode(16383);
        let expected = Uint8Array.of(0b1_1111111, 0b0_1111111);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode VarLength 16383 properly.`, async () => {
        let observed = utils.VarLength.decode(Uint8Array.of(0b1_1111111, 0b0_1111111));
        let expected = 16383;
        console.assert(observed === expected);
    });
    test(`It should encode VarLength 16384 properly.`, async () => {
        let observed = utils.VarLength.encode(16384);
        let expected = Uint8Array.of(0b1_0000001, 0b1_0000000, 0b0_0000000);
        console.assert(utils.Chunk.equals(observed, expected));
    });
    test(`It should decode VarLength 16384 properly.`, async () => {
        let observed = utils.VarLength.decode(Uint8Array.of(0b1_0000001, 0b1_0000000, 0b0_0000000));
        let expected = 16384;
        console.assert(observed === expected);
    });
})();
