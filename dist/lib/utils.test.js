"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils = require("./utils");
function test(cb) {
    cb().catch((error) => {
        console.log(String(error));
    });
}
(async () => {
    test(async () => {
        let observed = utils.Chunk.equals(Uint8Array.of(0), Uint8Array.of(0));
        let expected = true;
        console.assert(observed === expected, `It should determine equality for chunks [0], [0] properly.`);
    });
    test(async () => {
        let observed = utils.Chunk.equals(Uint8Array.of(0), Uint8Array.of(1));
        let expected = false;
        console.assert(observed === expected, `It should determine equality for chunks [0], [1] properly.`);
    });
    test(async () => {
        let observed = utils.Chunk.comparePrefixes(Uint8Array.of(0), Uint8Array.of(0));
        let expected = 0;
        console.assert(observed === expected, `It should compare chunks [0], [0] properly.`);
    });
    test(async () => {
        let observed = utils.Chunk.comparePrefixes(Uint8Array.of(0), Uint8Array.of(1));
        let expected = -1;
        console.assert(observed === expected, `It should compare chunks [0], [1] properly.`);
    });
    test(async () => {
        let observed = utils.Chunk.comparePrefixes(Uint8Array.of(1), Uint8Array.of(0));
        let expected = 1;
        console.assert(observed === expected, `It should compare chunks [1], [0] properly.`);
    });
    test(async () => {
        let observed = utils.Chunk.comparePrefixes(Uint8Array.of(0, 0), Uint8Array.of(0));
        let expected = 1;
        console.assert(observed === expected, `It should compare chunks [0, 0], [0] properly.`);
    });
    test(async () => {
        let observed = utils.Chunk.comparePrefixes(Uint8Array.of(0, 1), Uint8Array.of(0));
        let expected = 1;
        console.assert(observed === expected, `It should compare chunks [0, 1], [0] properly.`);
    });
    test(async () => {
        let observed = utils.Chunk.comparePrefixes(Uint8Array.of(0, 1), Uint8Array.of(1));
        let expected = -1;
        console.assert(observed === expected, `It should compare chunks [0, 1], [1] properly.`);
    });
    test(async () => {
        let observed = utils.Chunk.concat([Uint8Array.of(1, 2), Uint8Array.of(3)]);
        let expected = Uint8Array.of(1, 2, 3);
        console.assert(utils.Chunk.equals(observed, expected), `It should concat chunks properly.`);
    });
})();
(async () => {
    test(async () => {
        let observed = utils.VarCategory.encode(-128);
        let expected = Uint8Array.of(0b00_000000, 0b00_0000000, 0b01_111110);
        console.assert(utils.Chunk.equals(observed, expected), `It should encode VarCategory -128 properly.`);
    });
    test(async () => {
        let observed = utils.VarCategory.decode(Uint8Array.of(0b00_000000, 0b00_0000000, 0b01_111110));
        let expected = -128;
        console.assert(observed === expected, `It should decode VarCategory -128 properly.`);
    });
    test(async () => {
        let observed = utils.VarCategory.encode(-127);
        let expected = Uint8Array.of(0b00_0000000, 0b01_000000);
        console.assert(utils.Chunk.equals(observed, expected), `It should encode VarCategory -127 properly.`);
    });
    test(async () => {
        let observed = utils.VarCategory.decode(Uint8Array.of(0b00_0000000, 0b01_000000));
        let expected = -127;
        console.assert(observed === expected, `It should decode VarCategory -127 properly.`);
    });
    test(async () => {
        let observed = utils.VarCategory.encode(-65);
        let expected = Uint8Array.of(0b00_0000000, 0b01_111110);
        console.assert(utils.Chunk.equals(observed, expected), `It should encode VarCategory -65 properly.`);
    });
    test(async () => {
        let observed = utils.VarCategory.decode(Uint8Array.of(0b00_0000000, 0b01_111110));
        let expected = -65;
        console.assert(observed === expected, `It should decode VarCategory -65 properly.`);
    });
    test(async () => {
        let observed = utils.VarCategory.encode(-64);
        let expected = Uint8Array.of(0b01_000000);
        console.assert(utils.Chunk.equals(observed, expected), `It should encode VarCategory -64 properly.`);
    });
    test(async () => {
        let observed = utils.VarCategory.decode(Uint8Array.of(0b01_000000));
        let expected = -64;
        console.assert(observed === expected, `It should decode VarCategory -64 properly.`);
    });
    test(async () => {
        let observed = utils.VarCategory.encode(-1);
        let expected = Uint8Array.of(0b01_111111);
        console.assert(utils.Chunk.equals(observed, expected), `It should encode VarCategory -1 properly.`);
    });
    test(async () => {
        let observed = utils.VarCategory.decode(Uint8Array.of(0b01_111111));
        let expected = -1;
        console.assert(observed === expected, `It should decode VarCategory -1 properly.`);
    });
    test(async () => {
        let observed = utils.VarCategory.encode(0);
        let expected = Uint8Array.of(0b10_000000);
        console.assert(utils.Chunk.equals(observed, expected), `It should encode VarCategory 0 properly.`);
    });
    test(async () => {
        let observed = utils.VarCategory.decode(Uint8Array.of(0b10_000000));
        let expected = 0;
        console.assert(observed === expected, `It should decode VarCategory 0 properly.`);
    });
    test(async () => {
        let observed = utils.VarCategory.encode(63);
        let expected = Uint8Array.of(0b10_111111);
        console.assert(utils.Chunk.equals(observed, expected), `It should encode VarCategory 63 properly.`);
    });
    test(async () => {
        let observed = utils.VarCategory.decode(Uint8Array.of(0b10_111111));
        let expected = 63;
        console.assert(observed === expected, `It should decode VarCategory 63 properly.`);
    });
    test(async () => {
        let observed = utils.VarCategory.encode(64);
        let expected = Uint8Array.of(0b11_111111, 0b10_000001);
        console.assert(utils.Chunk.equals(observed, expected), `It should encode VarCategory 64 properly.`);
    });
    test(async () => {
        let observed = utils.VarCategory.decode(Uint8Array.of(0b11_111111, 0b10_000001));
        let expected = 64;
        console.assert(observed === expected, `It should decode VarCategory 64 properly.`);
    });
    test(async () => {
        let observed = utils.VarCategory.encode(126);
        let expected = Uint8Array.of(0b11_111111, 0b10_111111);
        console.assert(utils.Chunk.equals(observed, expected), `It should encode VarCategory 126 properly.`);
    });
    test(async () => {
        let observed = utils.VarCategory.decode(Uint8Array.of(0b11_111111, 0b10_111111));
        let expected = 126;
        console.assert(observed === expected, `It should decode VarCategory 126 properly.`);
    });
    test(async () => {
        let observed = utils.VarCategory.encode(127);
        let expected = Uint8Array.of(0b11_111111, 0b11_111111, 0b10_000001);
        console.assert(utils.Chunk.equals(observed, expected), `It should encode VarCategory 127 properly.`);
    });
    test(async () => {
        let observed = utils.VarCategory.decode(Uint8Array.of(0b11_111111, 0b11_111111, 0b10_000001));
        let expected = 127;
        console.assert(observed === expected, `It should decode VarCategory 127 properly.`);
    });
})();
(async () => {
    test(async () => {
        let observed = utils.VarInteger.encode(-4097);
        let expected = Uint8Array.of(0b00_111110, 0b00_111111, 0b01_111111);
        console.assert(utils.Chunk.equals(observed, expected), `It should encode VarInteger -4097 properly.`);
    });
    test(async () => {
        let observed = utils.VarInteger.decode(Uint8Array.of(0b00_111110, 0b00_111111, 0b01_111111));
        let expected = -4097;
        console.assert(observed === expected, `It should decode VarInteger -4097 properly.`);
    });
    test(async () => {
        let observed = utils.VarInteger.encode(-4096);
        let expected = Uint8Array.of(0b00_000000, 0b01_000000);
        console.assert(utils.Chunk.equals(observed, expected), `It should encode VarInteger -4096 properly.`);
    });
    test(async () => {
        let observed = utils.VarInteger.decode(Uint8Array.of(0b00_000000, 0b01_000000));
        let expected = -4096;
        console.assert(observed === expected, `It should decode VarInteger -4096 properly.`);
    });
    test(async () => {
        let observed = utils.VarInteger.encode(-65);
        let expected = Uint8Array.of(0b00_111110, 0b01_111111);
        console.assert(utils.Chunk.equals(observed, expected), `It should encode VarInteger -65 properly.`);
    });
    test(async () => {
        let observed = utils.VarInteger.decode(Uint8Array.of(0b00_111110, 0b01_111111));
        let expected = -65;
        console.assert(observed === expected, `It should decode VarInteger -65 properly.`);
    });
    test(async () => {
        let observed = utils.VarInteger.encode(-64);
        let expected = Uint8Array.of(0b01_000000);
        console.assert(utils.Chunk.equals(observed, expected), `It should encode VarInteger -64 properly.`);
    });
    test(async () => {
        let observed = utils.VarInteger.decode(Uint8Array.of(0b01_000000));
        let expected = -64;
        console.assert(observed === expected, `It should decode VarInteger -64 properly.`);
    });
    test(async () => {
        let observed = utils.VarInteger.encode(-1);
        let expected = Uint8Array.of(0b01_111111);
        console.assert(utils.Chunk.equals(observed, expected), `It should encode VarInteger -1 properly.`);
    });
    test(async () => {
        let observed = utils.VarInteger.decode(Uint8Array.of(0b01_111111));
        let expected = -1;
        console.assert(observed === expected, `It should decode VarInteger -1 properly.`);
    });
    test(async () => {
        let observed = utils.VarInteger.encode(0);
        let expected = Uint8Array.of(0b10_000000);
        console.assert(utils.Chunk.equals(observed, expected), `It should encode VarInteger 0 properly.`);
    });
    test(async () => {
        let observed = utils.VarInteger.decode(Uint8Array.of(0b10_000000));
        let expected = 0;
        console.assert(observed === expected, `It should decode VarInteger 0 properly.`);
    });
    test(async () => {
        let observed = utils.VarInteger.encode(63);
        let expected = Uint8Array.of(0b10_111111);
        console.assert(utils.Chunk.equals(observed, expected), `It should encode VarInteger 63 properly.`);
    });
    test(async () => {
        let observed = utils.VarInteger.decode(Uint8Array.of(0b10_111111));
        let expected = 63;
        console.assert(observed === expected, `It should decode VarInteger 63 properly.`);
    });
    test(async () => {
        let observed = utils.VarInteger.encode(64);
        let expected = Uint8Array.of(0b11_000001, 0b10_000000);
        console.assert(utils.Chunk.equals(observed, expected), `It should encode VarInteger 64 properly.`);
    });
    test(async () => {
        let observed = utils.VarInteger.decode(Uint8Array.of(0b11_000001, 0b10_000000));
        let expected = 64;
        console.assert(observed === expected, `It should decode VarInteger 64 properly.`);
    });
    test(async () => {
        let observed = utils.VarInteger.encode(4095);
        let expected = Uint8Array.of(0b11_111111, 0b10_111111);
        console.assert(utils.Chunk.equals(observed, expected), `It should encode VarInteger 4095 properly.`);
    });
    test(async () => {
        let observed = utils.VarInteger.decode(Uint8Array.of(0b11_111111, 0b10_111111));
        let expected = 4095;
        console.assert(observed === expected, `It should decode VarInteger 4095 properly.`);
    });
    test(async () => {
        let observed = utils.VarInteger.encode(4096);
        let expected = Uint8Array.of(0b11_000001, 0b11_000000, 0b10_000000);
        console.assert(utils.Chunk.equals(observed, expected), `It should encode VarInteger 4096 properly.`);
    });
    test(async () => {
        let observed = utils.VarInteger.decode(Uint8Array.of(0b11_000001, 0b11_000000, 0b10_000000));
        let expected = 4096;
        console.assert(observed === expected, `It should decode VarInteger 4096 properly.`);
    });
})();
(async () => {
    test(async () => {
        let observed = utils.VarLength.encode(0);
        let expected = Uint8Array.of(0b0_0000000);
        console.assert(utils.Chunk.equals(observed, expected), `It should encode VarLength 0 properly.`);
    });
    test(async () => {
        let observed = utils.VarLength.decode(Uint8Array.of(0b0_0000000));
        let expected = 0;
        console.assert(observed === expected, `It should decode VarLength 0 properly.`);
    });
    test(async () => {
        let observed = utils.VarLength.encode(127);
        let expected = Uint8Array.of(0b0_1111111);
        console.assert(utils.Chunk.equals(observed, expected), `It should encode VarLength 127 properly.`);
    });
    test(async () => {
        let observed = utils.VarLength.decode(Uint8Array.of(0b0_1111111));
        let expected = 127;
        console.assert(observed === expected, `It should decode VarLength 127 properly.`);
    });
    test(async () => {
        let observed = utils.VarLength.encode(128);
        let expected = Uint8Array.of(0b1_0000001, 0b0_0000000);
        console.assert(utils.Chunk.equals(observed, expected), `It should encode VarLength 128 properly.`);
    });
    test(async () => {
        let observed = utils.VarLength.decode(Uint8Array.of(0b1_0000001, 0b0_0000000));
        let expected = 128;
        console.assert(observed === expected, `It should decode VarLength 128 properly.`);
    });
    test(async () => {
        let observed = utils.VarLength.encode(16383);
        let expected = Uint8Array.of(0b1_11111111, 0b0_1111111);
        console.assert(utils.Chunk.equals(observed, expected), `It should encode VarLength 16383 properly.`);
    });
    test(async () => {
        let observed = utils.VarLength.decode(Uint8Array.of(0b1_11111111, 0b0_1111111));
        let expected = 16383;
        console.assert(observed === expected, `It should decode VarLength 16383 properly.`);
    });
    test(async () => {
        let observed = utils.VarLength.encode(16384);
        let expected = Uint8Array.of(0b1_0000001, 0b1_0000000, 0b0_0000000);
        console.assert(utils.Chunk.equals(observed, expected), `It should encode VarLength 16384 properly.`);
    });
    test(async () => {
        let observed = utils.VarLength.decode(Uint8Array.of(0b1_0000001, 0b1_0000000, 0b0_0000000));
        let expected = 16384;
        console.assert(observed === expected, `It should decode VarLength 16384 properly.`);
    });
})();
