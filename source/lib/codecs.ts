import * as utils from "./utils";

type IntersectionOf<A> = (A extends any ? (_: A) => void : never) extends ((_: infer B) => void) ? B : never;

export class Packet {
	private constructor() {}

	static decode(parser: utils.Parser | Uint8Array): Uint8Array {
		parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
		return parser.try((parser) => {
			let length = utils.VarLength.decode(parser);
			let payload = parser.chunk(length);
			return payload;
		});
	}

	static encode(payload: Uint8Array): Uint8Array {
		return utils.Chunk.concat([
			utils.VarLength.encode(payload.length),
			payload
		]);
	}
};

export type CodecTuple<V extends any[]> = {
	[K in keyof V]: V[K] extends V[number] ? Codec<V[K]> : never;
};

export type CodecRecord<V extends Record<string, any>> = {
	[K in keyof V]: Codec<V[K]>;
};

export enum Tag {
	NULL = 0,
	FALSE = 1,
	TRUE = 2,
	NUMBER = 3,
	STRING = 4,
	BINARY = 5,
	BIGINT = 6,
	LIST = 7,
	MAP = 8
};

export abstract class Codec<V extends any> {
	constructor() {}

	abstract decodePayload(parser: utils.Parser | Uint8Array): V;

	abstract encodePayload(subject: V): Uint8Array;

	decode(parser: utils.Parser | Uint8Array): V {
		let payload = Packet.decode(parser);
		return this.decodePayload(payload);
	}

	encode(subject: V): Uint8Array {
		let payload = this.encodePayload(subject);
		return Packet.encode(payload);
	}
};

export class AnyCodec extends Codec<any> {
	constructor() {
		super();
	}

	decodePayload(parser: utils.Parser | Uint8Array): any {
		parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
		return parser.tryArray<any>([
			(parser) => Null.decodePayload(parser),
			(parser) => False.decodePayload(parser),
			(parser) => True.decodePayload(parser),
			(parser) => Number.decodePayload(parser),
			(parser) => String.decodePayload(parser),
			(parser) => Binary.decodePayload(parser),
			(parser) => BigInt.decodePayload(parser),
			(parser) => List.decodePayload(parser),
			(parser) => Map.decodePayload(parser),
			(parser) => Unknown.decodePayload(parser)
		]);
	}

	encodePayload(subject: any): Uint8Array {
		try {
			return Null.encodePayload(subject);
		} catch (error) {}
		try {
			return False.encodePayload(subject);
		} catch (error) {}
		try {
			return True.encodePayload(subject);
		} catch (error) {}
		try {
			return Number.encodePayload(subject);
		} catch (error) {}
		try {
			return String.encodePayload(subject);
		} catch (error) {}
		try {
			return Binary.encodePayload(subject);
		} catch (error) {}
		try {
			return BigInt.encodePayload(subject);
		} catch (error) {}
		try {
			return List.encodePayload(subject);
		} catch (error) {}
		try {
			return Map.encodePayload(subject);
		} catch (error) {}
		try {
			return Unknown.encodePayload(subject);
		} catch (error) {}
		throw `Expected subject to be encodable!`;
	}
};

export const Any = new AnyCodec();

export class NullCodec extends Codec<null> {
	constructor() {
		super();
	}

	decodePayload(parser: utils.Parser | Uint8Array): null {
		parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
		return parser.try((parser) => {
			utils.IntegerAssert.exactly(parser.unsigned(1), Tag.NULL);
			return null;
		});
	}

	encodePayload(subject: null): Uint8Array {
		if (subject !== null) {
			throw `Expected Null!`;
		}
		let chunks = [] as Array<Uint8Array>;
		chunks.push(Uint8Array.of(Tag.NULL));
		return utils.Chunk.concat(chunks);
	}
};

export const Null = new NullCodec();

export class FalseCodec extends Codec<false> {
	constructor() {
		super();
	}

	decodePayload(parser: utils.Parser | Uint8Array): false {
		parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
		return parser.try((parser) => {
			utils.IntegerAssert.exactly(parser.unsigned(1), Tag.FALSE);
			return false;
		});
	}

	encodePayload(subject: false): Uint8Array {
		if (subject !== false) {
			throw `Expected False!`;
		}
		let chunks = [] as Array<Uint8Array>;
		chunks.push(Uint8Array.of(Tag.FALSE));
		return utils.Chunk.concat(chunks);
	}
};

export const False = new FalseCodec();

export class TrueCodec extends Codec<true> {
	constructor() {
		super();
	}

	decodePayload(parser: utils.Parser | Uint8Array): true {
		parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
		return parser.try((parser) => {
			utils.IntegerAssert.exactly(parser.unsigned(1), Tag.TRUE);
			return true;
		});
	}

	encodePayload(subject: true): Uint8Array {
		if (subject !== true) {
			throw `Expected True!`;
		}
		let chunks = [] as Array<Uint8Array>;
		chunks.push(Uint8Array.of(Tag.TRUE));
		return utils.Chunk.concat(chunks);
	}
};

export const True = new TrueCodec();

export class NumberCodec extends Codec<number> {
	constructor() {
		super();
	}

	decodePayload(parser: utils.Parser | Uint8Array): number {
		parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
		return parser.try((parser) => {
			utils.IntegerAssert.exactly(parser.unsigned(1), Tag.NUMBER);
			let chunk = parser.chunk(8);
			if (((chunk[0] >> 7) & 0x01) === 0x01) {
				chunk[0] ^= 0x80;
				for (let i = 1; i < chunk.length; i++) {
					chunk[i] ^= 0x00;
				}
			} else {
				chunk[0] ^= 0xFF;
				for (let i = 1; i < chunk.length; i++) {
					chunk[i] ^= 0xFF;
				}
			}
			let value = new DataView(chunk.buffer).getFloat64(0, false);
			return value;
		});
	}

	encodePayload(subject: number): Uint8Array {
		if (subject == null || subject.constructor !== globalThis.Number) {
			throw `Expected Number!`;
		}
		let chunks = [] as Array<Uint8Array>;
		chunks.push(Uint8Array.of(Tag.NUMBER));
		let chunk = new Uint8Array(8);
		new DataView(chunk.buffer).setFloat64(0, subject, false);
		if (((chunk[0] >> 7) & 0x01) === 0x00) {
			chunk[0] ^= 0x80;
			for (let i = 1; i < chunk.length; i++) {
				chunk[i] ^= 0x00;
			}
		} else {
			chunk[0] ^= 0xFF;
			for (let i = 1; i < chunk.length; i++) {
				chunk[i] ^= 0xFF;
			}
		}
		chunks.push(chunk);
		return utils.Chunk.concat(chunks);
	}
};

export const Number = new NumberCodec();

export class StringCodec extends Codec<string> {
	constructor() {
		super();
	}

	decodePayload(parser: utils.Parser | Uint8Array): string {
		parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
		return parser.try((parser) => {
			utils.IntegerAssert.exactly(parser.unsigned(1), Tag.STRING);
			let value = utils.Chunk.toString(parser.chunk(), "utf-8");
			return value;
		});
	}

	encodePayload(subject: string): Uint8Array {
		if (subject == null || subject.constructor !== globalThis.String) {
			throw `Expected String!`;
		}
		let chunks = [] as Array<Uint8Array>;
		chunks.push(Uint8Array.of(Tag.STRING));
		chunks.push(utils.Chunk.fromString(subject, "utf-8"));
		return utils.Chunk.concat(chunks);
	}
};

export const String = new StringCodec();

export class BinaryCodec extends Codec<Uint8Array> {
	constructor() {
		super();
	}

	decodePayload(parser: utils.Parser | Uint8Array): Uint8Array {
		parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
		return parser.try((parser) => {
			utils.IntegerAssert.exactly(parser.unsigned(1), Tag.BINARY);
			let value = parser.chunk();
			return value;
		});
	}

	encodePayload(subject: Uint8Array): Uint8Array {
		if (subject == null || subject.constructor !== globalThis.Uint8Array) {
			throw `Expected Binary!`;
		}
		let chunks = [] as Array<Uint8Array>;
		chunks.push(Uint8Array.of(Tag.BINARY));
		chunks.push(subject);
		return utils.Chunk.concat(chunks);
	}
};

export const Binary = new BinaryCodec();

export class BigIntCodec extends Codec<bigint> {
	constructor() {
		super();
	}

	decodePayload(parser: utils.Parser | Uint8Array): bigint {
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
			} else {
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

	encodePayload(subject: bigint): Uint8Array {
		if (subject == null || subject.constructor !== globalThis.BigInt) {
			throw `Expected BigInt!`;
		}
		let chunks = [] as Array<Uint8Array>;
		chunks.push(Uint8Array.of(Tag.BIGINT));
		let bytes = [] as Array<number>;
		let value = subject;
		if (value >= 0n) {
			do {
				let byte = globalThis.Number(value & 0xFFn);
				value = value >> 8n;
				bytes.push(byte);
			} while (value > 0n);
			let category = utils.VarCategory.encode(bytes.length - 1);
			chunks.push(category);
		} else {
			value = 0n - value;
			value = value - 1n;
			do {
				let byte = ~globalThis.Number(value & 0xFFn) & 0xFF;
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
};

export const BigInt = new BigIntCodec();

export class ListCodec extends Codec<Array<any>> {
	constructor() {
		super();
	}

	decodePayload(parser: utils.Parser | Uint8Array, decode?: (index: number, parser: utils.Parser) => any): Array<any> {
		parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
		return parser.try((parser) => {
			utils.IntegerAssert.exactly(parser.unsigned(1), Tag.LIST);
			decode = decode ?? ((key, parser) => Any.decode(parser));
			let value = [] as Array<any>;
			let index = 0;
			while (!parser.eof()) {
				value.push(decode(index, parser));
				index += 1;
			}
			return value;
		});
	}

	encodePayload(subject: Array<any>, encode?: (index: number, subject: any) => Uint8Array): Uint8Array {
		if (subject == null || subject.constructor !== globalThis.Array) {
			throw `Expected Array!`;
		}
		encode = encode ?? ((key, subject) => Any.encode(subject));
		let chunks = [] as Array<Uint8Array>;
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
};

export const List = new ListCodec();

export class MapCodec extends Codec<Record<string, any>> {
	constructor() {
		super();
	}

	decodePayload(parser: utils.Parser | Uint8Array, decode?: (key: string, parser: utils.Parser) => any): Record<string, any> {
		parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
		return parser.try((parser) => {
			utils.IntegerAssert.exactly(parser.unsigned(1), Tag.MAP);
			decode = decode ?? ((key, parser) => Any.decode(parser));
			let value = {} as Record<string, any>;
			while (!parser.eof()) {
				let key = String.decode(parser);
				value[key] = decode(key, parser);
			}
			return value;
		});
	}

	encodePayload(subject: Record<string, any>, encode?: (key: string, subject: any) => Uint8Array): Uint8Array {
		if (subject == null || subject.constructor !== globalThis.Object) {
			throw `Expected Object!`;
		}
		encode = encode ?? ((key, subject) => Any.encode(subject));
		let chunks = [] as Array<Uint8Array>;
		chunks.push(Uint8Array.of(Tag.MAP));
		let pairs = [] as Array<{ key: Uint8Array, value: Uint8Array }>;
		for (let key in subject) {
			let value = subject[key];
			if (value === undefined) {
				continue;
			}
			pairs.push({
				key: String.encodePayload(key),
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
};

export const Map = new MapCodec();

export class UnknownValue {
	private chunk: Uint8Array;

	constructor(chunk: Uint8Array) {
		utils.IntegerAssert.atLeast(1, chunk.length);
		if (chunk[0] in Tag) {
			throw `Expected tag ${Tag[chunk[0]]} to be unknown!`;
		}
		this.chunk = chunk;
	}

	getChunk(): Uint8Array {
		return this.chunk;
	}
};

export class UnknownCodec extends Codec<UnknownValue> {
	constructor() {
		super();
	}

	decodePayload(parser: utils.Parser | Uint8Array): UnknownValue {
		parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
		return parser.try((parser) => {
			let value = parser.chunk();
			return new UnknownValue(value);
		});
	}

	encodePayload(subject: UnknownValue): Uint8Array {
		if (subject == null || subject.constructor !== UnknownValue) {
			throw `Expected Unknown!`;
		}
		let chunks = [] as Array<Uint8Array>;
		chunks.push(subject.getChunk());
		return utils.Chunk.concat(chunks);
	}
};

export const Unknown = new UnknownCodec();

export class BooleanCodec extends Codec<boolean> {
	constructor() {
		super();
	}

	decodePayload(parser: utils.Parser | Uint8Array): boolean {
		parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
		return parser.tryArray<boolean>([
			(parser) => True.decodePayload(parser),
			(parser) => False.decodePayload(parser)
		])
	}

	encodePayload(subject: boolean): Uint8Array {
		if (subject) {
			return True.encodePayload(subject);
		} else {
			return False.encodePayload(subject);
		}
	}
};

export const Boolean = new BooleanCodec();

export class ArrayCodec<V extends any> extends Codec<Array<V>> {
	private codec: Codec<V>;

	constructor(codec: Codec<V>) {
		super();
		this.codec = codec;
	}

	decodePayload(parser: utils.Parser | Uint8Array): Array<V> {
		return List.decodePayload(parser, (index, parser) => {
			return this.codec.decode(parser);
		});
	}

	encodePayload(subject: Array<V>): Uint8Array {
		return List.encodePayload(subject, (index, subject) => {
			return this.codec.encode(subject);
		});
	}
};

export const Array = {
	of<V extends any>(codec: Codec<V>): ArrayCodec<V> {
		return new ArrayCodec(codec);
	}
};

export class RecordCodec<V extends any> extends Codec<Record<string, V>> {
	private codec: Codec<V>;

	constructor(codec: Codec<V>) {
		super();
		this.codec = codec;
	}

	decodePayload(parser: utils.Parser | Uint8Array): Record<string, V> {
		return Map.decodePayload(parser, (key, parser) => {
			return this.codec.decode(parser);
		});
	}

	encodePayload(subject: Record<string, V>): Uint8Array {
		return Map.encodePayload(subject, (key, subject) => {
			return this.codec.encode(subject);
		});
	}
};

export const Record = {
	of<V extends any>(codec: Codec<V>): RecordCodec<V> {
		return new RecordCodec(codec);
	}
};

export class TupleCodec<V extends any[]> extends Codec<[...V]> {
	private codecs: CodecTuple<[...V]>;

	constructor(...codecs: CodecTuple<[...V]>) {
		super();
		this.codecs = codecs;
	}

	decodePayload(parser: utils.Parser | Uint8Array): [...V] {
		parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
		return parser.try((parser) => {
			let indices = new globalThis.Set(this.codecs.keys());
			let subject = List.decodePayload(parser, (index, parser) => {
				indices.delete(index);
				if (index in this.codecs) {
					return this.codecs[index].decode(parser);
				} else {
					return Any.decode(parser);
				}
			});
			if (indices.size !== 0) {
				throw `Expected members ${globalThis.Array.from(indices)} to be decoded!`;
			}
			return subject as [...V];
		});
	}

	encodePayload(subject: [...V]): Uint8Array {
		let indices = new globalThis.Set(this.codecs.keys());
		let payload = List.encodePayload(subject, (index, subject) => {
			indices.delete(index);
			if (index in this.codecs) {
				return this.codecs[index].encode(subject);
			} else {
				return Any.encode(subject);
			}
		});
		if (indices.size !== 0) {
			throw `Expected members ${globalThis.Array.from(indices)} to be encoded!`;
		}
		return payload;
	}
};

export const Tuple = {
	of<V extends any[]>(...codecs: CodecTuple<V>): TupleCodec<V> {
		return new TupleCodec(...codecs);
	}
};

export class ObjectCodec<V extends Record<string, any>> extends Codec<V> {
	private codecs: CodecRecord<V>;

	constructor(codecs: CodecRecord<V>) {
		super();
		this.codecs = codecs;
	}

	decodePayload(parser: utils.Parser | Uint8Array): V {
		parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
		return parser.try((parser) => {
			let keys = new Set(globalThis.Object.keys(this.codecs));
			let subject = Map.decodePayload(parser, (key, parser) => {
				keys.delete(key);
				if (key in this.codecs) {
					return this.codecs[key].decode(parser);
				} else {
					return Any.decode(parser);
				}
			});
			if (keys.size !== 0) {
				throw `Expected members ${globalThis.Array.from(keys)} to be decoded!`;
			}
			return subject as V;
		});
	}

	encodePayload(subject: V): Uint8Array {
		let keys = new Set(globalThis.Object.keys(this.codecs));
		let payload = Map.encodePayload(subject, (key, subject) => {
			keys.delete(key);
			if (key in this.codecs) {
				return this.codecs[key].encode(subject);
			} else {
				return Any.encode(subject);
			}
		});
		if (keys.size !== 0) {
			throw `Expected members ${globalThis.Array.from(keys)} to be encoded!`;
		}
		return payload;
	}
};

export const Object = {
	of<V extends Record<string, any>>(codecs: CodecRecord<V>): ObjectCodec<V> {
		return new ObjectCodec(codecs);
	}
};

export class UnionCodec<V extends any[]> extends Codec<V[number]> {
	private codecs: CodecTuple<[...V]>;

	constructor(...codecs: CodecTuple<[...V]>) {
		super();
		this.codecs = codecs;
	}

	decodePayload(parser: utils.Parser | Uint8Array): V[number] {
		for (let codec of this.codecs) {
			try {
				return codec.decodePayload(parser);
			} catch (error) {}
		}
		throw `Expected subject to be decodable!`;
	}

	encodePayload(subject: V[number]): Uint8Array {
		for (let codec of this.codecs) {
			try {
				return codec.encodePayload(subject);
			} catch (error) {}
		}
		throw `Expected subject to be encodable!`;
	}
};

export const Union = {
	of<V extends any[]>(...codecs: CodecTuple<V>): UnionCodec<V> {
		return new UnionCodec(...codecs);
	}
};

export class IntersectionCodec<V extends any[]> extends Codec<IntersectionOf<V[number]>> {
	private codecs: CodecRecord<[...V]>;

	constructor(...codecs: CodecRecord<[...V]>) {
		super();
		this.codecs = codecs;
	}

	decodePayload(parser: utils.Parser | Uint8Array): IntersectionOf<V[number]> {
		for (let codec of this.codecs) {
			codec.decodePayload(parser);
		}
		return Any.decodePayload(parser);
	}

	encodePayload(subject: IntersectionOf<V[number]>): Uint8Array {
		for (let codec of this.codecs) {
			codec.encodePayload(subject);
		}
		return Any.encodePayload(subject);
	}
};

export const Intersection = {
	of<V extends any[]>(...codecs: CodecRecord<V>): IntersectionCodec<V> {
		return new IntersectionCodec(...codecs);
	}
};

export class StringLiteralCodec<V extends string> extends Codec<V> {
	private value: V;

	constructor(value: V) {
		super();
		this.value = value;
	}

	decodePayload(parser: utils.Parser | Uint8Array): V {
		let subject = String.decodePayload(parser);
		if (subject !== this.value) {
			throw `Expected "${this.value}"!`;
		}
		return this.value;
	}

	encodePayload(subject: V): Uint8Array {
		if (subject !== this.value) {
			throw `Expected "${this.value}"!`;
		}
		return String.encodePayload(subject);
	}
};

export const StringLiteral = {
	of<V extends string>(value: V): StringLiteralCodec<V> {
		return new StringLiteralCodec(value);
	}
};

export class NumberLiteralCodec<V extends number> extends Codec<V> {
	private value: V;

	constructor(value: V) {
		super();
		this.value = value;
	}

	decodePayload(parser: utils.Parser | Uint8Array): V {
		let subject = Number.decodePayload(parser);
		if (subject !== this.value) {
			throw `Expected ${this.value}!`;
		}
		return this.value;
	}

	encodePayload(subject: V): Uint8Array {
		if (subject !== this.value) {
			throw `Expected ${this.value}!`;
		}
		return Number.encodePayload(subject);
	}
};

export const NumberLiteral = {
	of<V extends number>(value: V): NumberLiteralCodec<V> {
		return new NumberLiteralCodec(value);
	}
};

export class BigIntLiteralCodec<V extends bigint> extends Codec<V> {
	private value: V;

	constructor(value: V) {
		super();
		this.value = value;
	}

	decodePayload(parser: utils.Parser | Uint8Array): V {
		let subject = BigInt.decodePayload(parser);
		if (subject !== this.value) {
			throw `Expected ${this.value}!`;
		}
		return this.value;
	}

	encodePayload(subject: V): Uint8Array {
		if (subject !== this.value) {
			throw `Expected ${this.value}!`;
		}
		return BigInt.encodePayload(subject);
	}
};

export const BigIntLiteral = {
	of<V extends bigint>(value: V): BigIntLiteralCodec<V> {
		return new BigIntLiteralCodec(value);
	}
};

export class BooleanLiteralCodec<V extends boolean> extends Codec<V> {
	private value: V;

	constructor(value: V) {
		super();
		this.value = value;
	}

	decodePayload(parser: utils.Parser | Uint8Array): V {
		let subject = Boolean.decodePayload(parser);
		if (subject !== this.value) {
			throw `Expected ${this.value}!`;
		}
		return this.value;
	}

	encodePayload(subject: V): Uint8Array {
		if (subject !== this.value) {
			throw `Expected ${this.value}!`;
		}
		return Boolean.encodePayload(subject);
	}
};

export const BooleanLiteral = {
	of<V extends boolean>(value: V): BooleanLiteralCodec<V> {
		return new BooleanLiteralCodec(value);
	}
};
