import { Parser } from "@joelek/ts-stdlib/dist/lib/data/parser";
export { IntegerAssert } from "@joelek/ts-stdlib/dist/lib/asserts/integer";
export { Chunk } from "@joelek/ts-stdlib/dist/lib/data/chunk";
export { Parser } from "@joelek/ts-stdlib/dist/lib/data/parser";
export declare class VarCategory {
    private constructor();
    static decode(parser: Parser | Uint8Array, maxBytes?: number): number;
    static encode(value: number, maxBytes?: number): Uint8Array;
}
export declare class VarInteger {
    private constructor();
    static decode(parser: Parser | Uint8Array, maxBytes?: number): number;
    static encode(value: number, maxBytes?: number): Uint8Array;
}
export declare class VarLength {
    private constructor();
    static decode(parser: Parser | Uint8Array, maxBytes?: number): number;
    static encode(value: number, maxBytes?: number): Uint8Array;
}
