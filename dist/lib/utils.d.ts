export declare class Parser {
    private buffer;
    private offset;
    constructor(buffer: Uint8Array, offset?: number);
    chunk(length?: number): Uint8Array;
    eof(): boolean;
    signed(length: number, endian?: "big" | "little"): number;
    try<A>(supplier: (parser: Parser) => A): A;
    tryArray<A>(suppliers: Array<(parser: Parser) => A>): A;
    unsigned(length: number, endian?: "big" | "little"): number;
}
export declare class IntegerAssert {
    private constructor();
    static atLeast(min: number, value: number): number;
    static atMost(max: number, value: number): number;
    static between(min: number, value: number, max: number): number;
    static exactly(value: number, expected: number): number;
    static integer(value: number): number;
}
export declare class Chunk {
    private constructor();
    static fromString(string: string, encoding: "base64" | "base64url" | "binary" | "hex" | "utf-8"): Uint8Array;
    static toString(chunk: Uint8Array, encoding: "base64" | "base64url" | "binary" | "hex" | "utf-8"): string;
    static equals(one: Uint8Array, two: Uint8Array): boolean;
    static comparePrefixes(one: Uint8Array, two: Uint8Array): number;
    static concat(buffers: Array<Uint8Array>): Uint8Array;
}
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
