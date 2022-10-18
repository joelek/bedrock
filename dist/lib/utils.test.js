"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wtf = require("@joelek/wtf");
const utils = require("./utils");
wtf.test(`It should parse unsigned 1-byte big endian properly.`, async (assert) => {
    let parser = new utils.Parser(Uint8Array.of(1, 2, 3, 4, 5, 6));
    let observed = parser.unsigned(1, "big");
    let expected = 0x01;
    assert.equals(observed, expected);
});
wtf.test(`It should parse unsigned 2-byte big endian properly.`, async (assert) => {
    let parser = new utils.Parser(Uint8Array.of(1, 2, 3, 4, 5, 6));
    let observed = parser.unsigned(2, "big");
    let expected = 0x0102;
    assert.equals(observed, expected);
});
wtf.test(`It should parse unsigned 3-byte big endian properly.`, async (assert) => {
    let parser = new utils.Parser(Uint8Array.of(1, 2, 3, 4, 5, 6));
    let observed = parser.unsigned(3, "big");
    let expected = 0x010203;
    assert.equals(observed, expected);
});
wtf.test(`It should parse unsigned 4-byte big endian properly.`, async (assert) => {
    let parser = new utils.Parser(Uint8Array.of(1, 2, 3, 4, 5, 6));
    let observed = parser.unsigned(4, "big");
    let expected = 0x01020304;
    assert.equals(observed, expected);
});
wtf.test(`It should parse unsigned 5-byte big endian properly.`, async (assert) => {
    let parser = new utils.Parser(Uint8Array.of(1, 2, 3, 4, 5, 6));
    let observed = parser.unsigned(5, "big");
    let expected = 0x0102030405;
    assert.equals(observed, expected);
});
wtf.test(`It should parse unsigned 6-byte big endian properly.`, async (assert) => {
    let parser = new utils.Parser(Uint8Array.of(1, 2, 3, 4, 5, 6));
    let observed = parser.unsigned(6, "big");
    let expected = 0x010203040506;
    assert.equals(observed, expected);
});
wtf.test(`It should parse unsigned 1-byte little endian properly.`, async (assert) => {
    let parser = new utils.Parser(Uint8Array.of(1, 2, 3, 4, 5, 6));
    let observed = parser.unsigned(1, "little");
    let expected = 0x01;
    assert.equals(observed, expected);
});
wtf.test(`It should parse unsigned 2-byte little endian properly.`, async (assert) => {
    let parser = new utils.Parser(Uint8Array.of(1, 2, 3, 4, 5, 6));
    let observed = parser.unsigned(2, "little");
    let expected = 0x0201;
    assert.equals(observed, expected);
});
wtf.test(`It should parse unsigned 3-byte little endian properly.`, async (assert) => {
    let parser = new utils.Parser(Uint8Array.of(1, 2, 3, 4, 5, 6));
    let observed = parser.unsigned(3, "little");
    let expected = 0x030201;
    assert.equals(observed, expected);
});
wtf.test(`It should parse unsigned 4-byte little endian properly.`, async (assert) => {
    let parser = new utils.Parser(Uint8Array.of(1, 2, 3, 4, 5, 6));
    let observed = parser.unsigned(4, "little");
    let expected = 0x04030201;
    assert.equals(observed, expected);
});
wtf.test(`It should parse unsigned 5-byte little endian properly.`, async (assert) => {
    let parser = new utils.Parser(Uint8Array.of(1, 2, 3, 4, 5, 6));
    let observed = parser.unsigned(5, "little");
    let expected = 0x0504030201;
    assert.equals(observed, expected);
});
wtf.test(`It should parse unsigned 6-byte little endian properly.`, async (assert) => {
    let parser = new utils.Parser(Uint8Array.of(1, 2, 3, 4, 5, 6));
    let observed = parser.unsigned(6, "little");
    let expected = 0x060504030201;
    assert.equals(observed, expected);
});
wtf.test(`It should convert chunks to strings "binary" properly.`, async (assert) => {
    let observed = utils.Chunk.toString(Uint8Array.of(0x00, 0x0F, 0xF0, 0xFF), "binary");
    let expected = "\x00\x0F\xF0\xFF";
    assert.equals(observed, expected);
});
wtf.test(`It should convert strings to chunks "binary" properly.`, async (assert) => {
    let observed = utils.Chunk.fromString("\x00\x0F\xF0\xFF", "binary");
    let expected = Uint8Array.of(0x00, 0x0F, 0xF0, 0xFF);
    assert.equals(observed, expected);
});
wtf.test(`It should convert chunks to strings "base64" properly.`, async (assert) => {
    let observed = utils.Chunk.toString(Uint8Array.of(0x00, 0x0F, 0xF0, 0xFF), "base64");
    let expected = "AA/w/w==";
    assert.equals(observed, expected);
});
wtf.test(`It should convert strings to chunks "base64" properly.`, async (assert) => {
    let observed = utils.Chunk.fromString("AA/w/w==", "base64");
    let expected = Uint8Array.of(0x00, 0x0F, 0xF0, 0xFF);
    assert.equals(observed, expected);
});
wtf.test(`It should convert chunks to strings "base64url" properly.`, async (assert) => {
    let observed = utils.Chunk.toString(Uint8Array.of(0x00, 0x0F, 0xF0, 0xFF), "base64url");
    let expected = "AA_w_w";
    assert.equals(observed, expected);
});
wtf.test(`It should convert strings to chunks "base64url" properly.`, async (assert) => {
    let observed = utils.Chunk.fromString("AA_w_w", "base64url");
    let expected = Uint8Array.of(0x00, 0x0F, 0xF0, 0xFF);
    assert.equals(observed, expected);
});
wtf.test(`It should convert chunks to strings "hex" properly.`, async (assert) => {
    let observed = utils.Chunk.toString(Uint8Array.of(0x00, 0x0F, 0xF0, 0xFF), "hex");
    let expected = "000FF0FF";
    assert.equals(observed, expected);
});
wtf.test(`It should convert strings to chunks "hex" properly.`, async (assert) => {
    let observed = utils.Chunk.fromString("000FF0FF", "hex");
    let expected = Uint8Array.of(0x00, 0x0F, 0xF0, 0xFF);
    assert.equals(observed, expected);
});
wtf.test(`It should convert chunks to strings "utf-8" properly.`, async (assert) => {
    let observed = utils.Chunk.toString(Uint8Array.of(0xF0, 0x9F, 0x9A, 0x80), "utf-8");
    let expected = "\u{1F680}";
    assert.equals(observed, expected);
});
wtf.test(`It should convert strings to chunks "utf-8" properly.`, async (assert) => {
    let observed = utils.Chunk.fromString("\u{1F680}", "utf-8");
    let expected = Uint8Array.of(0xF0, 0x9F, 0x9A, 0x80);
    assert.equals(observed, expected);
});
wtf.test(`It should determine equality for chunks [0], [0] properly.`, async (assert) => {
    let observed = utils.Chunk.equals(Uint8Array.of(0), Uint8Array.of(0));
    let expected = true;
    assert.equals(observed, expected);
});
wtf.test(`It should determine equality for chunks [0], [1] properly.`, async (assert) => {
    let observed = utils.Chunk.equals(Uint8Array.of(0), Uint8Array.of(1));
    let expected = false;
    assert.equals(observed, expected);
});
wtf.test(`It should compare chunks ([0] < [0,1]).`, async (assert) => {
    let observed = utils.Chunk.comparePrefixes(Uint8Array.of(0), Uint8Array.of(0, 1));
    let expected = -1;
    assert.equals(observed, expected);
});
wtf.test(`It should compare chunks ([1] > [0,1]).`, async (assert) => {
    let observed = utils.Chunk.comparePrefixes(Uint8Array.of(1), Uint8Array.of(0, 1));
    let expected = 1;
    assert.equals(observed, expected);
});
wtf.test(`It should compare chunks ([2] > [0,1]).`, async (assert) => {
    let observed = utils.Chunk.comparePrefixes(Uint8Array.of(2), Uint8Array.of(0, 1));
    let expected = 1;
    assert.equals(observed, expected);
});
wtf.test(`It should compare chunks ([0] < [1,1]).`, async (assert) => {
    let observed = utils.Chunk.comparePrefixes(Uint8Array.of(0), Uint8Array.of(1, 1));
    let expected = -1;
    assert.equals(observed, expected);
});
wtf.test(`It should compare chunks ([1] < [1,1]).`, async (assert) => {
    let observed = utils.Chunk.comparePrefixes(Uint8Array.of(1), Uint8Array.of(1, 1));
    let expected = -1;
    assert.equals(observed, expected);
});
wtf.test(`It should compare chunks ([2] > [1,1]).`, async (assert) => {
    let observed = utils.Chunk.comparePrefixes(Uint8Array.of(2), Uint8Array.of(1, 1));
    let expected = 1;
    assert.equals(observed, expected);
});
wtf.test(`It should compare chunks ([0] < [2,1]).`, async (assert) => {
    let observed = utils.Chunk.comparePrefixes(Uint8Array.of(0), Uint8Array.of(2, 1));
    let expected = -1;
    assert.equals(observed, expected);
});
wtf.test(`It should compare chunks ([1] < [2,1]).`, async (assert) => {
    let observed = utils.Chunk.comparePrefixes(Uint8Array.of(1), Uint8Array.of(2, 1));
    let expected = -1;
    assert.equals(observed, expected);
});
wtf.test(`It should compare chunks ([2] < [2,1]).`, async (assert) => {
    let observed = utils.Chunk.comparePrefixes(Uint8Array.of(2), Uint8Array.of(2, 1));
    let expected = -1;
    assert.equals(observed, expected);
});
wtf.test(`It should compare chunks ([0,0] < [0,1]).`, async (assert) => {
    let observed = utils.Chunk.comparePrefixes(Uint8Array.of(0, 0), Uint8Array.of(0, 1));
    let expected = -1;
    assert.equals(observed, expected);
});
wtf.test(`It should compare chunks ([0,1] = [0,1]).`, async (assert) => {
    let observed = utils.Chunk.comparePrefixes(Uint8Array.of(0, 1), Uint8Array.of(0, 1));
    let expected = 0;
    assert.equals(observed, expected);
});
wtf.test(`It should compare chunks ([0,2] > [0,1]).`, async (assert) => {
    let observed = utils.Chunk.comparePrefixes(Uint8Array.of(0, 2), Uint8Array.of(0, 1));
    let expected = 1;
    assert.equals(observed, expected);
});
wtf.test(`It should compare chunks ([0,0] < [1,1]).`, async (assert) => {
    let observed = utils.Chunk.comparePrefixes(Uint8Array.of(0, 0), Uint8Array.of(1, 1));
    let expected = -1;
    assert.equals(observed, expected);
});
wtf.test(`It should compare chunks ([0,1] < [1,1]).`, async (assert) => {
    let observed = utils.Chunk.comparePrefixes(Uint8Array.of(0, 1), Uint8Array.of(1, 1));
    let expected = -1;
    assert.equals(observed, expected);
});
wtf.test(`It should compare chunks ([0,2] < [1,1]).`, async (assert) => {
    let observed = utils.Chunk.comparePrefixes(Uint8Array.of(0, 2), Uint8Array.of(1, 1));
    let expected = -1;
    assert.equals(observed, expected);
});
wtf.test(`It should compare chunks ([0,0] < [2,1]).`, async (assert) => {
    let observed = utils.Chunk.comparePrefixes(Uint8Array.of(0, 0), Uint8Array.of(2, 1));
    let expected = -1;
    assert.equals(observed, expected);
});
wtf.test(`It should compare chunks ([0,1] < [2,1]).`, async (assert) => {
    let observed = utils.Chunk.comparePrefixes(Uint8Array.of(0, 1), Uint8Array.of(2, 1));
    let expected = -1;
    assert.equals(observed, expected);
});
wtf.test(`It should compare chunks ([0,2] < [2,1]).`, async (assert) => {
    let observed = utils.Chunk.comparePrefixes(Uint8Array.of(0, 2), Uint8Array.of(2, 1));
    let expected = -1;
    assert.equals(observed, expected);
});
wtf.test(`It should compare chunks ([1,0] > [0,1]).`, async (assert) => {
    let observed = utils.Chunk.comparePrefixes(Uint8Array.of(1, 0), Uint8Array.of(0, 1));
    let expected = 1;
    assert.equals(observed, expected);
});
wtf.test(`It should compare chunks ([1,1] > [0,1]).`, async (assert) => {
    let observed = utils.Chunk.comparePrefixes(Uint8Array.of(1, 1), Uint8Array.of(0, 1));
    let expected = 1;
    assert.equals(observed, expected);
});
wtf.test(`It should compare chunks ([1,2] > [0,1]).`, async (assert) => {
    let observed = utils.Chunk.comparePrefixes(Uint8Array.of(1, 2), Uint8Array.of(0, 1));
    let expected = 1;
    assert.equals(observed, expected);
});
wtf.test(`It should compare chunks ([1,0] < [1,1]).`, async (assert) => {
    let observed = utils.Chunk.comparePrefixes(Uint8Array.of(1, 0), Uint8Array.of(1, 1));
    let expected = -1;
    assert.equals(observed, expected);
});
wtf.test(`It should compare chunks ([1,1] = [1,1]).`, async (assert) => {
    let observed = utils.Chunk.comparePrefixes(Uint8Array.of(1, 1), Uint8Array.of(1, 1));
    let expected = 0;
    assert.equals(observed, expected);
});
wtf.test(`It should compare chunks ([1,2] > [1,1]).`, async (assert) => {
    let observed = utils.Chunk.comparePrefixes(Uint8Array.of(1, 2), Uint8Array.of(1, 1));
    let expected = 1;
    assert.equals(observed, expected);
});
wtf.test(`It should compare chunks ([1,0] < [2,1]).`, async (assert) => {
    let observed = utils.Chunk.comparePrefixes(Uint8Array.of(1, 0), Uint8Array.of(2, 1));
    let expected = -1;
    assert.equals(observed, expected);
});
wtf.test(`It should compare chunks ([1,1] < [2,1]).`, async (assert) => {
    let observed = utils.Chunk.comparePrefixes(Uint8Array.of(1, 1), Uint8Array.of(2, 1));
    let expected = -1;
    assert.equals(observed, expected);
});
wtf.test(`It should compare chunks ([1,2] < [2,1]).`, async (assert) => {
    let observed = utils.Chunk.comparePrefixes(Uint8Array.of(1, 2), Uint8Array.of(2, 1));
    let expected = -1;
    assert.equals(observed, expected);
});
wtf.test(`It should compare chunks ([2,0] > [0,1]).`, async (assert) => {
    let observed = utils.Chunk.comparePrefixes(Uint8Array.of(2, 0), Uint8Array.of(0, 1));
    let expected = 1;
    assert.equals(observed, expected);
});
wtf.test(`It should compare chunks ([2,1] > [0,1]).`, async (assert) => {
    let observed = utils.Chunk.comparePrefixes(Uint8Array.of(2, 1), Uint8Array.of(0, 1));
    let expected = 1;
    assert.equals(observed, expected);
});
wtf.test(`It should compare chunks ([2,2] > [0,1]).`, async (assert) => {
    let observed = utils.Chunk.comparePrefixes(Uint8Array.of(2, 2), Uint8Array.of(0, 1));
    let expected = 1;
    assert.equals(observed, expected);
});
wtf.test(`It should compare chunks ([2,0] > [1,1]).`, async (assert) => {
    let observed = utils.Chunk.comparePrefixes(Uint8Array.of(2, 0), Uint8Array.of(1, 1));
    let expected = 1;
    assert.equals(observed, expected);
});
wtf.test(`It should compare chunks ([2,1] > [1,1]).`, async (assert) => {
    let observed = utils.Chunk.comparePrefixes(Uint8Array.of(2, 1), Uint8Array.of(1, 1));
    let expected = 1;
    assert.equals(observed, expected);
});
wtf.test(`It should compare chunks ([2,2] > [1,1]).`, async (assert) => {
    let observed = utils.Chunk.comparePrefixes(Uint8Array.of(2, 2), Uint8Array.of(1, 1));
    let expected = 1;
    assert.equals(observed, expected);
});
wtf.test(`It should compare chunks ([2,0] < [2,1]).`, async (assert) => {
    let observed = utils.Chunk.comparePrefixes(Uint8Array.of(2, 0), Uint8Array.of(2, 1));
    let expected = -1;
    assert.equals(observed, expected);
});
wtf.test(`It should compare chunks ([2,1] = [2,1]).`, async (assert) => {
    let observed = utils.Chunk.comparePrefixes(Uint8Array.of(2, 1), Uint8Array.of(2, 1));
    let expected = 0;
    assert.equals(observed, expected);
});
wtf.test(`It should compare chunks ([2,2] > [2,1]).`, async (assert) => {
    let observed = utils.Chunk.comparePrefixes(Uint8Array.of(2, 2), Uint8Array.of(2, 1));
    let expected = 1;
    assert.equals(observed, expected);
});
wtf.test(`It should compare chunks "bb" > "a" properly.`, async (assert) => {
    let observed = utils.Chunk.comparePrefixes(utils.Chunk.fromString("bb", "binary"), utils.Chunk.fromString("a", "binary"));
    let expected = 1;
    assert.equals(observed, expected);
});
wtf.test(`It should compare chunks "bb" < "c" properly.`, async (assert) => {
    let observed = utils.Chunk.comparePrefixes(utils.Chunk.fromString("bb", "binary"), utils.Chunk.fromString("c", "binary"));
    let expected = -1;
    assert.equals(observed, expected);
});
wtf.test(`It should compare chunks "a" < "bb" properly.`, async (assert) => {
    let observed = utils.Chunk.comparePrefixes(utils.Chunk.fromString("a", "binary"), utils.Chunk.fromString("bb", "binary"));
    let expected = -1;
    assert.equals(observed, expected);
});
wtf.test(`It should compare chunks "c" > "bb" properly.`, async (assert) => {
    let observed = utils.Chunk.comparePrefixes(utils.Chunk.fromString("c", "binary"), utils.Chunk.fromString("bb", "binary"));
    let expected = 1;
    assert.equals(observed, expected);
});
wtf.test(`It should compare chunks "ba" < "bb" properly.`, async (assert) => {
    let observed = utils.Chunk.comparePrefixes(utils.Chunk.fromString("ba", "binary"), utils.Chunk.fromString("bb", "binary"));
    let expected = -1;
    assert.equals(observed, expected);
});
wtf.test(`It should compare chunks "bc" > "bb" properly.`, async (assert) => {
    let observed = utils.Chunk.comparePrefixes(utils.Chunk.fromString("bc", "binary"), utils.Chunk.fromString("bb", "binary"));
    let expected = 1;
    assert.equals(observed, expected);
});
wtf.test(`It should concat chunks properly.`, async (assert) => {
    let observed = utils.Chunk.concat([Uint8Array.of(1, 2), Uint8Array.of(3)]);
    let expected = Uint8Array.of(1, 2, 3);
    assert.equals(observed, expected);
});
wtf.test(`It should encode VarCategory -128 properly.`, async (assert) => {
    let observed = utils.VarCategory.encode(-128);
    let expected = Uint8Array.of(0b00_000000, 0b00_0000000, 0b01_111110);
    assert.equals(observed, expected);
});
wtf.test(`It should decode VarCategory -128 properly.`, async (assert) => {
    let observed = utils.VarCategory.decode(Uint8Array.of(0b00_000000, 0b00_0000000, 0b01_111110));
    let expected = -128;
    assert.equals(observed, expected);
});
wtf.test(`It should encode VarCategory -127 properly.`, async (assert) => {
    let observed = utils.VarCategory.encode(-127);
    let expected = Uint8Array.of(0b00_0000000, 0b01_000000);
    assert.equals(observed, expected);
});
wtf.test(`It should decode VarCategory -127 properly.`, async (assert) => {
    let observed = utils.VarCategory.decode(Uint8Array.of(0b00_0000000, 0b01_000000));
    let expected = -127;
    assert.equals(observed, expected);
});
wtf.test(`It should encode VarCategory -65 properly.`, async (assert) => {
    let observed = utils.VarCategory.encode(-65);
    let expected = Uint8Array.of(0b00_0000000, 0b01_111110);
    assert.equals(observed, expected);
});
wtf.test(`It should decode VarCategory -65 properly.`, async (assert) => {
    let observed = utils.VarCategory.decode(Uint8Array.of(0b00_0000000, 0b01_111110));
    let expected = -65;
    assert.equals(observed, expected);
});
wtf.test(`It should encode VarCategory -64 properly.`, async (assert) => {
    let observed = utils.VarCategory.encode(-64);
    let expected = Uint8Array.of(0b01_000000);
    assert.equals(observed, expected);
});
wtf.test(`It should decode VarCategory -64 properly.`, async (assert) => {
    let observed = utils.VarCategory.decode(Uint8Array.of(0b01_000000));
    let expected = -64;
    assert.equals(observed, expected);
});
wtf.test(`It should encode VarCategory -1 properly.`, async (assert) => {
    let observed = utils.VarCategory.encode(-1);
    let expected = Uint8Array.of(0b01_111111);
    assert.equals(observed, expected);
});
wtf.test(`It should decode VarCategory -1 properly.`, async (assert) => {
    let observed = utils.VarCategory.decode(Uint8Array.of(0b01_111111));
    let expected = -1;
    assert.equals(observed, expected);
});
wtf.test(`It should encode VarCategory 0 properly.`, async (assert) => {
    let observed = utils.VarCategory.encode(0);
    let expected = Uint8Array.of(0b10_000000);
    assert.equals(observed, expected);
});
wtf.test(`It should decode VarCategory 0 properly.`, async (assert) => {
    let observed = utils.VarCategory.decode(Uint8Array.of(0b10_000000));
    let expected = 0;
    assert.equals(observed, expected);
});
wtf.test(`It should encode VarCategory 63 properly.`, async (assert) => {
    let observed = utils.VarCategory.encode(63);
    let expected = Uint8Array.of(0b10_111111);
    assert.equals(observed, expected);
});
wtf.test(`It should decode VarCategory 63 properly.`, async (assert) => {
    let observed = utils.VarCategory.decode(Uint8Array.of(0b10_111111));
    let expected = 63;
    assert.equals(observed, expected);
});
wtf.test(`It should encode VarCategory 64 properly.`, async (assert) => {
    let observed = utils.VarCategory.encode(64);
    let expected = Uint8Array.of(0b11_111111, 0b10_000001);
    assert.equals(observed, expected);
});
wtf.test(`It should decode VarCategory 64 properly.`, async (assert) => {
    let observed = utils.VarCategory.decode(Uint8Array.of(0b11_111111, 0b10_000001));
    let expected = 64;
    assert.equals(observed, expected);
});
wtf.test(`It should encode VarCategory 126 properly.`, async (assert) => {
    let observed = utils.VarCategory.encode(126);
    let expected = Uint8Array.of(0b11_111111, 0b10_111111);
    assert.equals(observed, expected);
});
wtf.test(`It should decode VarCategory 126 properly.`, async (assert) => {
    let observed = utils.VarCategory.decode(Uint8Array.of(0b11_111111, 0b10_111111));
    let expected = 126;
    assert.equals(observed, expected);
});
wtf.test(`It should encode VarCategory 127 properly.`, async (assert) => {
    let observed = utils.VarCategory.encode(127);
    let expected = Uint8Array.of(0b11_111111, 0b11_111111, 0b10_000001);
    assert.equals(observed, expected);
});
wtf.test(`It should decode VarCategory 127 properly.`, async (assert) => {
    let observed = utils.VarCategory.decode(Uint8Array.of(0b11_111111, 0b11_111111, 0b10_000001));
    let expected = 127;
    assert.equals(observed, expected);
});
wtf.test(`It should maintain VarCategory sort order.`, async (assert) => {
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
            assert.equals(last <= number, true);
        }
        last = number;
    }
});
wtf.test(`It should encode VarInteger -4097 properly.`, async (assert) => {
    let observed = utils.VarInteger.encode(-4097);
    let expected = Uint8Array.of(0b00_111110, 0b00_111111, 0b01_111111);
    assert.equals(observed, expected);
});
wtf.test(`It should decode VarInteger -4097 properly.`, async (assert) => {
    let observed = utils.VarInteger.decode(Uint8Array.of(0b00_111110, 0b00_111111, 0b01_111111));
    let expected = -4097;
    assert.equals(observed, expected);
});
wtf.test(`It should encode VarInteger -4096 properly.`, async (assert) => {
    let observed = utils.VarInteger.encode(-4096);
    let expected = Uint8Array.of(0b00_000000, 0b01_000000);
    assert.equals(observed, expected);
});
wtf.test(`It should decode VarInteger -4096 properly.`, async (assert) => {
    let observed = utils.VarInteger.decode(Uint8Array.of(0b00_000000, 0b01_000000));
    let expected = -4096;
    assert.equals(observed, expected);
});
wtf.test(`It should encode VarInteger -65 properly.`, async (assert) => {
    let observed = utils.VarInteger.encode(-65);
    let expected = Uint8Array.of(0b00_111110, 0b01_111111);
    assert.equals(observed, expected);
});
wtf.test(`It should decode VarInteger -65 properly.`, async (assert) => {
    let observed = utils.VarInteger.decode(Uint8Array.of(0b00_111110, 0b01_111111));
    let expected = -65;
    assert.equals(observed, expected);
});
wtf.test(`It should encode VarInteger -64 properly.`, async (assert) => {
    let observed = utils.VarInteger.encode(-64);
    let expected = Uint8Array.of(0b01_000000);
    assert.equals(observed, expected);
});
wtf.test(`It should decode VarInteger -64 properly.`, async (assert) => {
    let observed = utils.VarInteger.decode(Uint8Array.of(0b01_000000));
    let expected = -64;
    assert.equals(observed, expected);
});
wtf.test(`It should encode VarInteger -1 properly.`, async (assert) => {
    let observed = utils.VarInteger.encode(-1);
    let expected = Uint8Array.of(0b01_111111);
    assert.equals(observed, expected);
});
wtf.test(`It should decode VarInteger -1 properly.`, async (assert) => {
    let observed = utils.VarInteger.decode(Uint8Array.of(0b01_111111));
    let expected = -1;
    assert.equals(observed, expected);
});
wtf.test(`It should encode VarInteger 0 properly.`, async (assert) => {
    let observed = utils.VarInteger.encode(0);
    let expected = Uint8Array.of(0b10_000000);
    assert.equals(observed, expected);
});
wtf.test(`It should decode VarInteger 0 properly.`, async (assert) => {
    let observed = utils.VarInteger.decode(Uint8Array.of(0b10_000000));
    let expected = 0;
    assert.equals(observed, expected);
});
wtf.test(`It should encode VarInteger 63 properly.`, async (assert) => {
    let observed = utils.VarInteger.encode(63);
    let expected = Uint8Array.of(0b10_111111);
    assert.equals(observed, expected);
});
wtf.test(`It should decode VarInteger 63 properly.`, async (assert) => {
    let observed = utils.VarInteger.decode(Uint8Array.of(0b10_111111));
    let expected = 63;
    assert.equals(observed, expected);
});
wtf.test(`It should encode VarInteger 64 properly.`, async (assert) => {
    let observed = utils.VarInteger.encode(64);
    let expected = Uint8Array.of(0b11_000001, 0b10_000000);
    assert.equals(observed, expected);
});
wtf.test(`It should decode VarInteger 64 properly.`, async (assert) => {
    let observed = utils.VarInteger.decode(Uint8Array.of(0b11_000001, 0b10_000000));
    let expected = 64;
    assert.equals(observed, expected);
});
wtf.test(`It should encode VarInteger 4095 properly.`, async (assert) => {
    let observed = utils.VarInteger.encode(4095);
    let expected = Uint8Array.of(0b11_111111, 0b10_111111);
    assert.equals(observed, expected);
});
wtf.test(`It should decode VarInteger 4095 properly.`, async (assert) => {
    let observed = utils.VarInteger.decode(Uint8Array.of(0b11_111111, 0b10_111111));
    let expected = 4095;
    assert.equals(observed, expected);
});
wtf.test(`It should encode VarInteger 4096 properly.`, async (assert) => {
    let observed = utils.VarInteger.encode(4096);
    let expected = Uint8Array.of(0b11_000001, 0b11_000000, 0b10_000000);
    assert.equals(observed, expected);
});
wtf.test(`It should decode VarInteger 4096 properly.`, async (assert) => {
    let observed = utils.VarInteger.decode(Uint8Array.of(0b11_000001, 0b11_000000, 0b10_000000));
    let expected = 4096;
    assert.equals(observed, expected);
});
wtf.test(`It should encode VarLength 0 properly.`, async (assert) => {
    let observed = utils.VarLength.encode(0);
    let expected = Uint8Array.of(0b0_0000000);
    assert.equals(observed, expected);
});
wtf.test(`It should decode VarLength 0 properly.`, async (assert) => {
    let observed = utils.VarLength.decode(Uint8Array.of(0b0_0000000));
    let expected = 0;
    assert.equals(observed, expected);
});
wtf.test(`It should encode VarLength 127 properly.`, async (assert) => {
    let observed = utils.VarLength.encode(127);
    let expected = Uint8Array.of(0b0_1111111);
    assert.equals(observed, expected);
});
wtf.test(`It should decode VarLength 127 properly.`, async (assert) => {
    let observed = utils.VarLength.decode(Uint8Array.of(0b0_1111111));
    let expected = 127;
    assert.equals(observed, expected);
});
wtf.test(`It should encode VarLength 128 properly.`, async (assert) => {
    let observed = utils.VarLength.encode(128);
    let expected = Uint8Array.of(0b1_0000001, 0b0_0000000);
    assert.equals(observed, expected);
});
wtf.test(`It should decode VarLength 128 properly.`, async (assert) => {
    let observed = utils.VarLength.decode(Uint8Array.of(0b1_0000001, 0b0_0000000));
    let expected = 128;
    assert.equals(observed, expected);
});
wtf.test(`It should encode VarLength 16383 properly.`, async (assert) => {
    let observed = utils.VarLength.encode(16383);
    let expected = Uint8Array.of(0b1_1111111, 0b0_1111111);
    assert.equals(observed, expected);
});
wtf.test(`It should decode VarLength 16383 properly.`, async (assert) => {
    let observed = utils.VarLength.decode(Uint8Array.of(0b1_1111111, 0b0_1111111));
    let expected = 16383;
    assert.equals(observed, expected);
});
wtf.test(`It should encode VarLength 16384 properly.`, async (assert) => {
    let observed = utils.VarLength.encode(16384);
    let expected = Uint8Array.of(0b1_0000001, 0b1_0000000, 0b0_0000000);
    assert.equals(observed, expected);
});
wtf.test(`It should decode VarLength 16384 properly.`, async (assert) => {
    let observed = utils.VarLength.decode(Uint8Array.of(0b1_0000001, 0b1_0000000, 0b0_0000000));
    let expected = 16384;
    assert.equals(observed, expected);
});
