import * as utils from "./utils";
type ExpansionOf<A> = A extends infer B ? {
    [C in keyof B]: B[C];
} : never;
type IntersectionOf<A> = (A extends any ? (_: A) => void : never) extends ((_: infer B) => void) ? B : never;
export declare class Packet {
    private constructor();
    static decode(parser: utils.Parser | Uint8Array): Uint8Array;
    static encode(payload: Uint8Array): Uint8Array;
}
export type CodecTuple<V extends any[]> = {
    [K in keyof V]: Codec<V[K]>;
};
export type CodecRecord<V extends Record<string, any>> = {
    [K in keyof V]: Codec<V[K]>;
};
export declare enum Tag {
    NULL = 0,
    FALSE = 1,
    TRUE = 2,
    NUMBER = 3,
    STRING = 4,
    BINARY = 5,
    BIGINT = 6,
    LIST = 7,
    MAP = 8
}
export declare abstract class Codec<V extends any> {
    constructor();
    abstract decodePayload(parser: utils.Parser | Uint8Array, path?: string): V;
    abstract encodePayload(subject: V, path?: string): Uint8Array;
    decode(parser: utils.Parser | Uint8Array, path?: string): V;
    encode(subject: V, path?: string): Uint8Array;
}
export declare class AnyCodec extends Codec<any> {
    constructor();
    decodePayload(parser: utils.Parser | Uint8Array, path?: string): any;
    encodePayload(subject: any, path?: string): Uint8Array;
}
export declare const Any: AnyCodec;
export declare class NullCodec extends Codec<null> {
    constructor();
    decodePayload(parser: utils.Parser | Uint8Array, path?: string): null;
    encodePayload(subject: null, path?: string): Uint8Array;
}
export declare const Null: NullCodec;
export declare class FalseCodec extends Codec<false> {
    constructor();
    decodePayload(parser: utils.Parser | Uint8Array, path?: string): false;
    encodePayload(subject: false, path?: string): Uint8Array;
}
export declare const False: FalseCodec;
export declare class TrueCodec extends Codec<true> {
    constructor();
    decodePayload(parser: utils.Parser | Uint8Array, path?: string): true;
    encodePayload(subject: true, path?: string): Uint8Array;
}
export declare const True: TrueCodec;
export declare class NumberCodec extends Codec<number> {
    constructor();
    decodePayload(parser: utils.Parser | Uint8Array, path?: string): number;
    encodePayload(subject: number, path?: string): Uint8Array;
}
export declare const Number: NumberCodec;
export declare class StringCodec extends Codec<string> {
    constructor();
    decodePayload(parser: utils.Parser | Uint8Array, path?: string): string;
    encodePayload(subject: string, path?: string): Uint8Array;
}
export declare const String: StringCodec;
export declare class BinaryCodec extends Codec<Uint8Array> {
    constructor();
    decodePayload(parser: utils.Parser | Uint8Array, path?: string): Uint8Array;
    encodePayload(subject: Uint8Array, path?: string): Uint8Array;
}
export declare const Binary: BinaryCodec;
export declare class BigIntCodec extends Codec<bigint> {
    constructor();
    decodePayload(parser: utils.Parser | Uint8Array, path?: string): bigint;
    encodePayload(subject: bigint, path?: string): Uint8Array;
}
export declare const BigInt: BigIntCodec;
export declare class ListCodec extends Codec<Array<any>> {
    constructor();
    decodePayload(parser: utils.Parser | Uint8Array, path?: string, decode?: (index: number, path: string, parser: utils.Parser) => any): Array<any>;
    encodePayload(subject: Array<any>, path?: string, encode?: (index: number, path: string, subject: any) => Uint8Array): Uint8Array;
}
export declare const List: ListCodec;
export declare class MapCodec extends Codec<Record<string, any>> {
    constructor();
    decodePayload(parser: utils.Parser | Uint8Array, path?: string, decode?: (key: string, path: string, parser: utils.Parser) => any): Record<string, any>;
    encodePayload(subject: Record<string, any>, path?: string, encode?: (key: string, path: string, subject: any) => Uint8Array): Uint8Array;
}
export declare const Map: MapCodec;
export declare class UnknownValue {
    private chunk;
    constructor(chunk: Uint8Array);
    getChunk(): Uint8Array;
}
export declare class UnknownCodec extends Codec<UnknownValue> {
    constructor();
    decodePayload(parser: utils.Parser | Uint8Array, path?: string): UnknownValue;
    encodePayload(subject: UnknownValue, path?: string): Uint8Array;
}
export declare const Unknown: UnknownCodec;
export declare class BooleanCodec extends Codec<boolean> {
    constructor();
    decodePayload(parser: utils.Parser | Uint8Array, path?: string): boolean;
    encodePayload(subject: boolean, path?: string): Uint8Array;
}
export declare const Boolean: BooleanCodec;
export declare class ArrayCodec<V extends any> extends Codec<Array<V>> {
    private codec;
    constructor(codec: Codec<V>);
    decodePayload(parser: utils.Parser | Uint8Array, path?: string): Array<V>;
    encodePayload(subject: Array<V>, path?: string): Uint8Array;
}
export declare const Array: {
    of<V extends unknown>(codec: Codec<V>): ArrayCodec<V>;
};
export declare class RecordCodec<V extends any> extends Codec<Record<string, V>> {
    private codec;
    constructor(codec: Codec<V>);
    decodePayload(parser: utils.Parser | Uint8Array, path?: string): Record<string, V>;
    encodePayload(subject: Record<string, V>, path?: string): Uint8Array;
}
export declare const Record: {
    of<V extends unknown>(codec: Codec<V>): RecordCodec<V>;
};
export declare class TupleCodec<V extends any[]> extends Codec<[...V]> {
    private codecs;
    constructor(...codecs: CodecTuple<[...V]>);
    decodePayload(parser: utils.Parser | Uint8Array, path?: string): [...V];
    encodePayload(subject: [...V], path?: string): Uint8Array;
}
export declare const Tuple: {
    of<V extends any[]>(...codecs: CodecTuple<V>): TupleCodec<V>;
};
export declare class ObjectCodec<Vreq extends Record<string, any>, Vopt extends Record<string, any> = {}> extends Codec<ExpansionOf<Vreq & Partial<Vopt>>> {
    private required;
    private optional;
    constructor(required: CodecRecord<Vreq>, optional?: CodecRecord<Vopt>);
    decodePayload(parser: utils.Parser | Uint8Array, path?: string): ExpansionOf<Vreq & Partial<Vopt>>;
    encodePayload(subject: ExpansionOf<Vreq & Partial<Vopt>>, path?: string): Uint8Array;
}
export declare const Object: {
    of<Vreq extends Record<string, any>, Vopt extends Record<string, any> = {}>(required: CodecRecord<Vreq>, optional?: CodecRecord<Vopt> | undefined): ObjectCodec<Vreq, Vopt>;
};
export declare class UnionCodec<V extends any[]> extends Codec<V[number]> {
    private codecs;
    constructor(...codecs: CodecTuple<[...V]>);
    decodePayload(parser: utils.Parser | Uint8Array, path?: string): V[number];
    encodePayload(subject: V[number], path?: string): Uint8Array;
}
export declare const Union: {
    of<V extends any[]>(...codecs: CodecTuple<V>): UnionCodec<V>;
};
export declare class IntersectionCodec<V extends any[]> extends Codec<IntersectionOf<V[number]>> {
    private codecs;
    constructor(...codecs: CodecRecord<[...V]>);
    decodePayload(parser: utils.Parser | Uint8Array, path?: string): IntersectionOf<V[number]>;
    encodePayload(subject: IntersectionOf<V[number]>, path?: string): Uint8Array;
}
export declare const Intersection: {
    of<V extends any[]>(...codecs: CodecRecord<V>): IntersectionCodec<V>;
};
export declare class IntegerCodec extends Codec<number> {
    constructor();
    decodePayload(parser: utils.Parser | Uint8Array, path?: string): number;
    encodePayload(subject: number, path?: string): Uint8Array;
}
export declare const Integer: IntegerCodec;
export declare class StringLiteralCodec<V extends string> extends Codec<V> {
    private value;
    constructor(value: V);
    decodePayload(parser: utils.Parser | Uint8Array, path?: string): V;
    encodePayload(subject: V, path?: string): Uint8Array;
}
export declare const StringLiteral: {
    of<V extends string>(value: V): StringLiteralCodec<V>;
};
export declare class NumberLiteralCodec<V extends number> extends Codec<V> {
    private value;
    constructor(value: V);
    decodePayload(parser: utils.Parser | Uint8Array, path?: string): V;
    encodePayload(subject: V, path?: string): Uint8Array;
}
export declare const NumberLiteral: {
    of<V extends number>(value: V): NumberLiteralCodec<V>;
};
export declare class BigIntLiteralCodec<V extends bigint> extends Codec<V> {
    private value;
    constructor(value: V);
    decodePayload(parser: utils.Parser | Uint8Array, path?: string): V;
    encodePayload(subject: V, path?: string): Uint8Array;
}
export declare const BigIntLiteral: {
    of<V extends bigint>(value: V): BigIntLiteralCodec<V>;
};
export declare class BooleanLiteralCodec<V extends boolean> extends Codec<V> {
    private value;
    constructor(value: V);
    decodePayload(parser: utils.Parser | Uint8Array, path?: string): V;
    encodePayload(subject: V, path?: string): Uint8Array;
}
export declare const BooleanLiteral: {
    of<V extends boolean>(value: V): BooleanLiteralCodec<V>;
};
export declare class IntegerLiteralCodec<V extends number> extends Codec<V> {
    private value;
    constructor(value: V);
    decodePayload(parser: utils.Parser | Uint8Array, path?: string): V;
    encodePayload(subject: V, path?: string): Uint8Array;
}
export declare const IntegerLiteral: {
    of<V extends number>(value: V): IntegerLiteralCodec<V>;
};
export {};
