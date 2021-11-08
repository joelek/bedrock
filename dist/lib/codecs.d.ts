import * as utils from "./utils";
export declare type CodecTuple<V extends any[]> = {
    [K in keyof V]: V[K] extends V[number] ? Codec<V[K]> : never;
};
export declare type CodecRecord<V extends Record<string, any>> = {
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
    abstract decodePayload(parser: utils.Parser | Uint8Array): V;
    abstract encodePayload(subject: V): Uint8Array;
    decode(parser: utils.Parser | Uint8Array): V;
    encode(subject: V): Uint8Array;
}
export declare class AnyCodec extends Codec<any> {
    constructor();
    decodePayload(parser: utils.Parser | Uint8Array): any;
    encodePayload(subject: any): Uint8Array;
}
export declare const Any: AnyCodec;
export declare class NullCodec extends Codec<null> {
    constructor();
    decodePayload(parser: utils.Parser | Uint8Array): null;
    encodePayload(subject: null): Uint8Array;
}
export declare const Null: NullCodec;
export declare class FalseCodec extends Codec<false> {
    constructor();
    decodePayload(parser: utils.Parser | Uint8Array): false;
    encodePayload(subject: false): Uint8Array;
}
export declare const False: FalseCodec;
export declare class TrueCodec extends Codec<true> {
    constructor();
    decodePayload(parser: utils.Parser | Uint8Array): true;
    encodePayload(subject: true): Uint8Array;
}
export declare const True: TrueCodec;
export declare class NumberCodec extends Codec<number> {
    constructor();
    decodePayload(parser: utils.Parser | Uint8Array): number;
    encodePayload(subject: number): Uint8Array;
}
export declare const Number: NumberCodec;
export declare class StringCodec extends Codec<string> {
    constructor();
    decodePayload(parser: utils.Parser | Uint8Array): string;
    encodePayload(subject: string): Uint8Array;
}
export declare const String: StringCodec;
export declare class BinaryCodec extends Codec<Uint8Array> {
    constructor();
    decodePayload(parser: utils.Parser | Uint8Array): Uint8Array;
    encodePayload(subject: Uint8Array): Uint8Array;
}
export declare const Binary: BinaryCodec;
export declare class BigIntCodec extends Codec<bigint> {
    constructor();
    decodePayload(parser: utils.Parser | Uint8Array): bigint;
    encodePayload(subject: bigint): Uint8Array;
}
export declare const BigInt: BigIntCodec;
export declare class ListCodec extends Codec<Array<any>> {
    constructor();
    decodePayload(parser: utils.Parser | Uint8Array, decode?: (index: number, parser: utils.Parser) => any): Array<any>;
    encodePayload(subject: Array<any>, encode?: (index: number, subject: any) => Uint8Array): Uint8Array;
}
export declare const List: ListCodec;
export declare class MapCodec extends Codec<Record<string, any>> {
    constructor();
    decodePayload(parser: utils.Parser | Uint8Array, decode?: (key: string, parser: utils.Parser) => any): Record<string, any>;
    encodePayload(subject: Record<string, any>, encode?: (key: string, subject: any) => Uint8Array): Uint8Array;
}
export declare const Map: MapCodec;
export declare class UnknownValue {
    private chunk;
    constructor(chunk: Uint8Array);
    getChunk(): Uint8Array;
}
export declare class UnknownCodec extends Codec<UnknownValue> {
    constructor();
    decodePayload(parser: utils.Parser | Uint8Array): UnknownValue;
    encodePayload(subject: UnknownValue): Uint8Array;
}
export declare const Unknown: UnknownCodec;
export declare class BooleanCodec extends Codec<boolean> {
    constructor();
    decodePayload(parser: utils.Parser | Uint8Array): boolean;
    encodePayload(subject: boolean): Uint8Array;
}
export declare const Boolean: BooleanCodec;
export declare class ArrayCodec<V extends any> extends Codec<Array<V>> {
    private codec;
    constructor(codec: Codec<V>);
    decodePayload(parser: utils.Parser | Uint8Array): Array<V>;
    encodePayload(subject: Array<V>): Uint8Array;
}
export declare const Array: {
    of<V extends unknown>(codec: Codec<V>): ArrayCodec<V>;
};
export declare class RecordCodec<V extends any> extends Codec<Record<string, V>> {
    private codec;
    constructor(codec: Codec<V>);
    decodePayload(parser: utils.Parser | Uint8Array): Record<string, V>;
    encodePayload(subject: Record<string, V>): Uint8Array;
}
export declare const Record: {
    of<V extends unknown>(codec: Codec<V>): RecordCodec<V>;
};
export declare class TupleCodec<V extends any[]> extends Codec<[...V, ...any[]]> {
    private codecs;
    constructor(...codecs: CodecTuple<[...V]>);
    decodePayload(parser: utils.Parser | Uint8Array): [...V, ...any[]];
    encodePayload(subject: [...V, ...any[]]): Uint8Array;
}
export declare const Tuple: {
    of<V extends any[]>(...codecs: CodecTuple<V>): TupleCodec<V>;
};
export declare class ObjectCodec<V extends Record<string, any>> extends Codec<V & Record<string, any>> {
    private codecs;
    constructor(codecs: CodecRecord<V>);
    decodePayload(parser: utils.Parser | Uint8Array): V & Record<string, any>;
    encodePayload(subject: V & Record<string, any>): Uint8Array;
}
export declare const Object: {
    of<V extends Record<string, any>>(codecs: CodecRecord<V>): ObjectCodec<V>;
};
export declare class UnionCodec<V extends any[]> extends Codec<V[number]> {
    private codecs;
    constructor(...codecs: CodecTuple<[...V]>);
    decodePayload(parser: utils.Parser | Uint8Array): V[number];
    encodePayload(subject: V[number]): Uint8Array;
}
export declare const Union: {
    of<V extends any[]>(...codecs: CodecTuple<V>): UnionCodec<V>;
};
