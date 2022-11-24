import * as utils from "./utils";

type ExpansionOf<A> = A extends infer B ? { [C in keyof B]: B[C] } : never;
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
	[K in keyof V]: Codec<V[K]>;
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

	abstract decodePayload(parser: utils.Parser | Uint8Array, path?: string): V;

	abstract encodePayload(subject: V, path?: string): Uint8Array;

	decode(parser: utils.Parser | Uint8Array, path: string = ""): V {
		let payload = Packet.decode(parser);
		return this.decodePayload(payload, path);
	}

	encode(subject: V, path: string = ""): Uint8Array {
		let payload = this.encodePayload(subject, path);
		return Packet.encode(payload);
	}
};

export class AnyCodec extends Codec<any> {
	constructor() {
		super();
	}

	decodePayload(parser: utils.Parser | Uint8Array, path: string = ""): any {
		parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
		return parser.tryArray<any>([
			(parser) => Null.decodePayload(parser, path),
			(parser) => False.decodePayload(parser, path),
			(parser) => True.decodePayload(parser, path),
			(parser) => Number.decodePayload(parser, path),
			(parser) => String.decodePayload(parser, path),
			(parser) => Binary.decodePayload(parser, path),
			(parser) => BigInt.decodePayload(parser, path),
			(parser) => List.decodePayload(parser, path),
			(parser) => Map.decodePayload(parser, path),
			(parser) => Unknown.decodePayload(parser, path)
		]);
	}

	encodePayload(subject: any, path: string = ""): Uint8Array {
		try {
			return Null.encodePayload(subject, path);
		} catch (error) {}
		try {
			return False.encodePayload(subject, path);
		} catch (error) {}
		try {
			return True.encodePayload(subject, path);
		} catch (error) {}
		try {
			return Number.encodePayload(subject, path);
		} catch (error) {}
		try {
			return String.encodePayload(subject, path);
		} catch (error) {}
		try {
			return Binary.encodePayload(subject, path);
		} catch (error) {}
		try {
			return BigInt.encodePayload(subject, path);
		} catch (error) {}
		try {
			return List.encodePayload(subject, path);
		} catch (error) {}
		try {
			return Map.encodePayload(subject, path);
		} catch (error) {}
		try {
			return Unknown.encodePayload(subject, path);
		} catch (error) {}
		throw new Error(`Expected subject to be encodable!`);
	}
};

export const Any = new AnyCodec();

export class NullCodec extends Codec<null> {
	constructor() {
		super();
	}

	decodePayload(parser: utils.Parser | Uint8Array, path: string = ""): null {
		parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
		return parser.try((parser) => {
			if (parser.unsigned(1) !== Tag.NULL) {
				throw new Error(`Expected Null at ${path}!`);
			}
			return null;
		});
	}

	encodePayload(subject: null, path: string = ""): Uint8Array {
		if (subject !== null) {
			throw new Error(`Expected Null at ${path}!`);
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

	decodePayload(parser: utils.Parser | Uint8Array, path: string = ""): false {
		parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
		return parser.try((parser) => {
			if (parser.unsigned(1) !== Tag.FALSE) {
				throw new Error(`Expected False at ${path}!`);
			}
			return false;
		});
	}

	encodePayload(subject: false, path: string = ""): Uint8Array {
		if (subject !== false) {
			throw new Error(`Expected False at ${path}!`);
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

	decodePayload(parser: utils.Parser | Uint8Array, path: string = ""): true {
		parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
		return parser.try((parser) => {
			if (parser.unsigned(1) !== Tag.TRUE) {
				throw new Error(`Expected True at ${path}!`);
			}
			return true;
		});
	}

	encodePayload(subject: true, path: string = ""): Uint8Array {
		if (subject !== true) {
			throw new Error(`Expected True at ${path}!`);
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

	decodePayload(parser: utils.Parser | Uint8Array, path: string = ""): number {
		parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
		return parser.try((parser) => {
			if (parser.unsigned(1) !== Tag.NUMBER) {
				throw new Error(`Expected Number at ${path}!`);
			}
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

	encodePayload(subject: number, path: string = ""): Uint8Array {
		if (subject == null || subject.constructor !== globalThis.Number) {
			throw new Error(`Expected Number at ${path}!`);
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

	decodePayload(parser: utils.Parser | Uint8Array, path: string = ""): string {
		parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
		return parser.try((parser) => {
			if (parser.unsigned(1) !== Tag.STRING) {
				throw new Error(`Expected String at ${path}!`);
			}
			let value = utils.Chunk.toString(parser.chunk(), "utf-8");
			return value;
		});
	}

	encodePayload(subject: string, path: string = ""): Uint8Array {
		if (subject == null || subject.constructor !== globalThis.String) {
			throw new Error(`Expected String at ${path}!`);
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

	decodePayload(parser: utils.Parser | Uint8Array, path: string = ""): Uint8Array {
		parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
		return parser.try((parser) => {
			if (parser.unsigned(1) !== Tag.BINARY) {
				throw new Error(`Expected Binary at ${path}!`);
			}
			let value = parser.chunk();
			return value;
		});
	}

	encodePayload(subject: Uint8Array, path: string = ""): Uint8Array {
		if (subject == null || !(subject instanceof globalThis.Uint8Array)) {
			throw new Error(`Expected Binary at ${path}!`);
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

	decodePayload(parser: utils.Parser | Uint8Array, path: string = ""): bigint {
		parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
		return parser.try((parser) => {
			if (parser.unsigned(1) !== Tag.BIGINT) {
				throw new Error(`Expected BigInt at ${path}!`);
			}
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

	encodePayload(subject: bigint, path: string = ""): Uint8Array {
		if (subject == null || subject.constructor !== globalThis.BigInt) {
			throw new Error(`Expected BigInt at ${path}!`);
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

	decodePayload(parser: utils.Parser | Uint8Array, path: string = "", decode?: (index: number, path: string, parser: utils.Parser) => any): Array<any> {
		parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
		return parser.try((parser) => {
			if (parser.unsigned(1) !== Tag.LIST) {
				throw new Error(`Expected List at ${path}!`);
			}
			decode = decode ?? ((key, path, parser) => Any.decode(parser, path));
			let value = [] as Array<any>;
			let index = 0;
			while (!parser.eof()) {
				let subpath = `${path}[${index}]`;
				value.push(decode(index, subpath, parser));
				index += 1;
			}
			return value;
		});
	}

	encodePayload(subject: Array<any>, path: string = "", encode?: (index: number, path: string, subject: any) => Uint8Array): Uint8Array {
		if (subject == null || subject.constructor !== globalThis.Array) {
			throw new Error(`Expected List at ${path}!`);
		}
		encode = encode ?? ((key, path, subject) => Any.encode(subject, path));
		let chunks = [] as Array<Uint8Array>;
		chunks.push(Uint8Array.of(Tag.LIST));
		for (let index = 0; index < subject.length; index++) {
			let value = subject[index];
			if (value === undefined) {
				value = null;
			}
			let subpath = `${path}[${index}]`;
			chunks.push(encode(index, subpath, value));
		}
		return utils.Chunk.concat(chunks);
	}
};

export const List = new ListCodec();

export class MapCodec extends Codec<Record<string, any>> {
	constructor() {
		super();
	}

	decodePayload(parser: utils.Parser | Uint8Array, path: string = "", decode?: (key: string, path: string, parser: utils.Parser) => any): Record<string, any> {
		parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
		return parser.try((parser) => {
			if (parser.unsigned(1) !== Tag.MAP) {
				throw new Error(`Expected Map at ${path}!`);
			}
			decode = decode ?? ((key, path, parser) => Any.decode(parser, path));
			let value = {} as Record<string, any>;
			while (!parser.eof()) {
				let key = String.decode(parser);
				let subpath = /^[a-z][a-z0-9_]*$/isu.test(key) ? `${path}.${key}` : `${path}["${key}"]`;
				value[key] = decode(key, subpath, parser);
			}
			return value;
		});
	}

	encodePayload(subject: Record<string, any>, path: string = "", encode?: (key: string, path: string, subject: any) => Uint8Array): Uint8Array {
		if (subject == null || subject.constructor !== globalThis.Object) {
			throw new Error(`Expected Map at ${path}!`);
		}
		encode = encode ?? ((key, path, subject) => Any.encode(subject, path));
		let chunks = [] as Array<Uint8Array>;
		chunks.push(Uint8Array.of(Tag.MAP));
		let pairs = [] as Array<{ key: Uint8Array, value: Uint8Array }>;
		for (let key in subject) {
			let value = subject[key];
			if (value === undefined) {
				continue;
			}
			let subpath = /^[a-z][a-z0-9_]*$/isu.test(key) ? `${path}.${key}` : `${path}["${key}"]`;
			pairs.push({
				key: String.encodePayload(key),
				value: encode(key, subpath, value)
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
			throw new Error(`Expected tag ${Tag[chunk[0]]} to be unknown!`);
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

	decodePayload(parser: utils.Parser | Uint8Array, path: string = ""): UnknownValue {
		parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
		return parser.try((parser) => {
			let value = parser.chunk();
			return new UnknownValue(value);
		});
	}

	encodePayload(subject: UnknownValue, path: string = ""): Uint8Array {
		if (subject == null || subject.constructor !== UnknownValue) {
			throw new Error(`Expected Unknown at ${path}!`);
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

	decodePayload(parser: utils.Parser | Uint8Array, path: string = ""): boolean {
		parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
		return parser.tryArray<boolean>([
			(parser) => True.decodePayload(parser, path),
			(parser) => False.decodePayload(parser, path)
		])
	}

	encodePayload(subject: boolean, path: string = ""): Uint8Array {
		if (subject) {
			return True.encodePayload(subject, path);
		} else {
			return False.encodePayload(subject, path);
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

	decodePayload(parser: utils.Parser | Uint8Array, path: string = ""): Array<V> {
		return List.decodePayload(parser, path, (index, path, parser) => {
			return this.codec.decode(parser, path);
		});
	}

	encodePayload(subject: Array<V>, path: string = ""): Uint8Array {
		return List.encodePayload(subject, path, (index, path, subject) => {
			return this.codec.encode(subject, path);
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

	decodePayload(parser: utils.Parser | Uint8Array, path: string = ""): Record<string, V> {
		return Map.decodePayload(parser, path, (key, path, parser) => {
			return this.codec.decode(parser, path);
		});
	}

	encodePayload(subject: Record<string, V>, path: string = ""): Uint8Array {
		return Map.encodePayload(subject, path, (key, path, subject) => {
			return this.codec.encode(subject, path);
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

	decodePayload(parser: utils.Parser | Uint8Array, path: string = ""): [...V] {
		parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
		return parser.try((parser) => {
			let indices = new globalThis.Set(this.codecs.keys());
			let subject = List.decodePayload(parser, path, (index, path, parser) => {
				indices.delete(index);
				if (index in this.codecs) {
					return this.codecs[index].decode(parser, path);
				} else {
					return Any.decode(parser, path);
				}
			});
			if (indices.size !== 0) {
				throw new Error(`Expected members ${globalThis.Array.from(indices)} to be decoded!`);
			}
			return subject as [...V];
		});
	}

	encodePayload(subject: [...V], path: string = ""): Uint8Array {
		let indices = new globalThis.Set(this.codecs.keys());
		let payload = List.encodePayload(subject, path, (index, path, subject) => {
			indices.delete(index);
			if (index in this.codecs) {
				return this.codecs[index].encode(subject, path);
			} else {
				return Any.encode(subject, path);
			}
		});
		if (indices.size !== 0) {
			throw new Error(`Expected members ${globalThis.Array.from(indices)} to be encoded!`);
		}
		return payload;
	}
};

export const Tuple = {
	of<V extends any[]>(...codecs: CodecTuple<V>): TupleCodec<V> {
		return new TupleCodec(...codecs);
	}
};

export class ObjectCodec<Vreq extends Record<string, any>, Vopt extends Record<string, any> = {}> extends Codec<ExpansionOf<Vreq & Partial<Vopt>>> {
	private required: CodecRecord<Vreq>;
	private optional: CodecRecord<Vopt>;

	constructor(required: CodecRecord<Vreq>, optional?: CodecRecord<Vopt>) {
		super();
		this.required = required;
		this.optional = optional ?? {} as any;
	}

	decodePayload(parser: utils.Parser | Uint8Array, path: string = ""): ExpansionOf<Vreq & Partial<Vopt>> {
		parser = parser instanceof utils.Parser ? parser : new utils.Parser(parser);
		return parser.try((parser) => {
			let keys = new Set(globalThis.Object.keys(this.required));
			let subject = Map.decodePayload(parser, path, (key, path, parser) => {
				keys.delete(key);
				if (key in this.required) {
					return this.required[key].decode(parser, path);
				} else if (key in this.optional) {
					return this.optional[key].decode(parser, path);
				} else {
					return Any.decode(parser, path);
				}
			});
			if (keys.size !== 0) {
				throw new Error(`Expected members ${globalThis.Array.from(keys)} to be decoded!`);
			}
			return subject as ExpansionOf<Vreq & Partial<Vopt>>;
		});
	}

	encodePayload(subject: ExpansionOf<Vreq & Partial<Vopt>>, path: string = ""): Uint8Array {
		let keys = new Set(globalThis.Object.keys(this.required));
		let payload = Map.encodePayload(subject, path, (key, path, subject) => {
			keys.delete(key);
			if (key in this.required) {
				return this.required[key].encode(subject, path);
			} else if (key in this.optional) {
				return this.optional[key].encode(subject, path);
			} else {
				return Any.encode(subject, path);
			}
		});
		if (keys.size !== 0) {
			throw new Error(`Expected members ${globalThis.Array.from(keys)} to be encoded!`);
		}
		return payload;
	}
};

export const Object = {
	of<Vreq extends Record<string, any>, Vopt extends Record<string, any> = {}>(required: CodecRecord<Vreq>, optional?: CodecRecord<Vopt>): ObjectCodec<Vreq, Vopt> {
		return new ObjectCodec(required, optional);
	}
};

export class UnionCodec<V extends any[]> extends Codec<V[number]> {
	private codecs: CodecTuple<[...V]>;

	constructor(...codecs: CodecTuple<[...V]>) {
		super();
		this.codecs = codecs;
	}

	decodePayload(parser: utils.Parser | Uint8Array, path: string = ""): V[number] {
		for (let codec of this.codecs) {
			try {
				return codec.decodePayload(parser, path);
			} catch (error) {}
		}
		throw new Error(`Expected subject to be decodable!`);
	}

	encodePayload(subject: V[number], path: string = ""): Uint8Array {
		for (let codec of this.codecs) {
			try {
				return codec.encodePayload(subject, path);
			} catch (error) {}
		}
		throw new Error(`Expected subject to be encodable!`);
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

	decodePayload(parser: utils.Parser | Uint8Array, path: string = ""): IntersectionOf<V[number]> {
		for (let codec of this.codecs) {
			codec.decodePayload(parser, path);
		}
		return Any.decodePayload(parser, path);
	}

	encodePayload(subject: IntersectionOf<V[number]>, path: string = ""): Uint8Array {
		for (let codec of this.codecs) {
			codec.encodePayload(subject, path);
		}
		return Any.encodePayload(subject, path);
	}
};

export const Intersection = {
	of<V extends any[]>(...codecs: CodecRecord<V>): IntersectionCodec<V> {
		return new IntersectionCodec(...codecs);
	}
};

export class IntegerCodec extends Codec<number> {
	constructor() {
		super();
	}

	decodePayload(parser: utils.Parser | Uint8Array, path: string = ""): number {
		let subject = BigInt.decodePayload(parser, path);
		if (subject < globalThis.BigInt(globalThis.Number.MIN_SAFE_INTEGER)) {
			throw new Error(`Expected ${subject} at ${path} to be within safe range!`);
		}
		if (subject > globalThis.BigInt(globalThis.Number.MAX_SAFE_INTEGER)) {
			throw new Error(`Expected ${subject} at ${path} to be within safe range!`);
		}
		return globalThis.Number(subject);
	}

	encodePayload(subject: number, path: string = ""): Uint8Array {
		return BigInt.encodePayload(globalThis.BigInt(subject), path);
	}
};

export const Integer = new IntegerCodec();

export class StringLiteralCodec<V extends string> extends Codec<V> {
	private value: V;

	constructor(value: V) {
		super();
		this.value = value;
	}

	decodePayload(parser: utils.Parser | Uint8Array, path: string = ""): V {
		let subject = String.decodePayload(parser, path);
		if (subject !== this.value) {
			throw new Error(`Expected "${this.value}" at ${path}!`);
		}
		return this.value;
	}

	encodePayload(subject: V, path: string = ""): Uint8Array {
		if (subject !== this.value) {
			throw new Error(`Expected "${this.value}" at ${path}!`);
		}
		return String.encodePayload(subject, path);
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

	decodePayload(parser: utils.Parser | Uint8Array, path: string = ""): V {
		let subject = Number.decodePayload(parser, path);
		if (subject !== this.value) {
			throw new Error(`Expected ${this.value} at ${path}!`);
		}
		return this.value;
	}

	encodePayload(subject: V, path: string = ""): Uint8Array {
		if (subject !== this.value) {
			throw new Error(`Expected ${this.value} at ${path}!`);
		}
		return Number.encodePayload(subject, path);
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

	decodePayload(parser: utils.Parser | Uint8Array, path: string = ""): V {
		let subject = BigInt.decodePayload(parser, path);
		if (subject !== this.value) {
			throw new Error(`Expected ${this.value} at ${path}!`);
		}
		return this.value;
	}

	encodePayload(subject: V, path: string = ""): Uint8Array {
		if (subject !== this.value) {
			throw new Error(`Expected ${this.value} at ${path}!`);
		}
		return BigInt.encodePayload(subject, path);
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

	decodePayload(parser: utils.Parser | Uint8Array, path: string = ""): V {
		let subject = Boolean.decodePayload(parser, path);
		if (subject !== this.value) {
			throw new Error(`Expected ${this.value} at ${path}!`);
		}
		return this.value;
	}

	encodePayload(subject: V, path: string = ""): Uint8Array {
		if (subject !== this.value) {
			throw new Error(`Expected ${this.value} at ${path}!`);
		}
		return Boolean.encodePayload(subject, path);
	}
};

export const BooleanLiteral = {
	of<V extends boolean>(value: V): BooleanLiteralCodec<V> {
		return new BooleanLiteralCodec(value);
	}
};

export class IntegerLiteralCodec<V extends number> extends Codec<V> {
	private value: V;

	constructor(value: V) {
		super();
		this.value = value;
	}

	decodePayload(parser: utils.Parser | Uint8Array, path: string = ""): V {
		let subject = Integer.decodePayload(parser, path);
		if (subject !== this.value) {
			throw new Error(`Expected ${this.value} at ${path}!`);
		}
		return this.value;
	}

	encodePayload(subject: V, path: string = ""): Uint8Array {
		if (subject !== this.value) {
			throw new Error(`Expected ${this.value} at ${path}!`);
		}
		return Integer.encodePayload(subject, path);
	}
};

export const IntegerLiteral = {
	of<V extends number>(value: V): IntegerLiteralCodec<V> {
		return new IntegerLiteralCodec(value);
	}
};
