export class Parser {
	private buffer: Uint8Array;
	private offset: number;

	constructor(buffer: Uint8Array, offset?: number) {
		this.buffer = buffer;
		this.offset = offset ?? 0;
	}

	chunk(length?: number): Uint8Array {
		length = length ?? this.buffer.length - this.offset;
		if (this.offset + length > this.buffer.length) {
			throw new Error(`Expected to read at least ${length} bytes!`);
		}
		let buffer = this.buffer.slice(this.offset, this.offset + length);
		this.offset += length;
		return buffer;
	}

	eof(): boolean {
		return this.offset >= this.buffer.length;
	}

	signed(length: number, endian?: "big" | "little"): number {
		let value = this.unsigned(length, endian);
		let bias = 2 ** (length * 8 - 1);
		if (value >= bias) {
			value -= bias + bias;
		}
		return value;
	}

	try<A>(supplier: (parser: Parser) => A): A {
		let offset = this.offset;
		try {
			return supplier(this);
		} catch (error) {
			this.offset = offset;
			throw error;
		}
	}

	tryArray<A>(suppliers: Array<(parser: Parser) => A>): A {
		let offset = this.offset;
		for (let supplier of suppliers) {
			try {
				return supplier(this);
			} catch (error) {
				this.offset = offset;
			}
		}
		throw new Error(`Expected one supplier to succeed!`);
	}

	unsigned(length: number, endian?: "big" | "little"): number {
		IntegerAssert.between(1, length, 6);
		if (this.offset + length > this.buffer.length) {
			throw new Error(`Expected to read at least ${length} bytes!`);
		}
		if (endian === "little") {
			let value = 0;
			for (let i = length - 1; i >= 0; i--) {
				value *= 256;
				value += this.buffer[this.offset + i];
			}
			this.offset += length;
			return value;
		} else {
			let value = 0;
			for (let i = 0; i < length; i++) {
				value *= 256;
				value += this.buffer[this.offset + i];
			}
			this.offset += length;
			return value;
		}
	}
};

export class IntegerAssert {
	private constructor() {}

	static atLeast(min: number, value: number): number {
		this.integer(min);
		this.integer(value);
		if (value < min) {
			throw new Error(`Expected ${value} to be at least ${min}!`);
		}
		return value;
	}

	static atMost(max: number, value: number): number {
		this.integer(value);
		this.integer(max);
		if (value > max) {
			throw new Error(`Expected ${value} to be at most ${max}!`);
		}
		return value;
	}

	static between(min: number, value: number, max: number): number {
		this.integer(min);
		this.integer(value);
		this.integer(max);
		if (value < min || value > max) {
			throw new Error(`Expected ${value} to be between ${min} and ${max}!`);
		}
		return value;
	}

	static exactly(value: number, expected: number): number {
		this.integer(expected);
		this.integer(value);
		if (value !== expected) {
			throw new Error(`Expected ${value} to be exactly ${expected}!`);
		}
		return value;
	}

	static integer(value: number): number {
		if (!Number.isInteger(value)) {
			throw new Error(`Expected ${value} to be an integer!`);
		}
		return value;
	}
};

export class Chunk {
	private constructor() {}

	static fromString(string: string, encoding: "base64" | "base64url" | "binary" | "hex" | "utf-8"): Uint8Array {
		if (encoding === "binary") {
			let bytes = new Array<number>();
			for (let i = 0; i < string.length; i += 1) {
				let byte = string.charCodeAt(i);
				bytes.push(byte);
			}
			return Uint8Array.from(bytes);
		}
		if (encoding === "base64") {
			// @ts-ignore
			return Chunk.fromString(atob(string), "binary");
		}
		if (encoding === "base64url") {
			return Chunk.fromString(string.replaceAll("-", "+").replaceAll("_", "/"), "base64");
		}
		if (encoding === "hex") {
			if (string.length % 2 === 1) {
				string = `0${string}`;
			}
			let bytes = new Array<number>();
			for (let i = 0; i < string.length; i += 2) {
				let part = string.slice(i, i + 2);
				let byte = Number.parseInt(part, 16);
				bytes.push(byte);
			}
			return Uint8Array.from(bytes);
		}
		// @ts-ignore
		return new TextEncoder().encode(string);
	}

	static toString(chunk: Uint8Array, encoding: "base64" | "base64url" | "binary" | "hex" | "utf-8"): string {
		if (encoding === "binary") {
			let parts = new Array<string>();
			for (let byte of chunk) {
				let part = String.fromCharCode(byte);
				parts.push(part);
			}
			return parts.join("");
		}
		if (encoding === "base64") {
			// @ts-ignore
			return btoa(Chunk.toString(chunk, "binary"));
		}
		if (encoding === "base64url") {
			return Chunk.toString(chunk, "base64").replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
		}
		if (encoding === "hex") {
			let parts = new Array<string>();
			for (let byte of chunk) {
				let part = byte.toString(16).toUpperCase().padStart(2, "0");
				parts.push(part);
			}
			return parts.join("");
		}
		// @ts-ignore
		return new TextDecoder().decode(chunk);
	}

	static equals(one: Uint8Array, two: Uint8Array): boolean {
		return this.comparePrefixes(one, two) === 0;
	}

	static comparePrefixes(one: Uint8Array, two: Uint8Array): number {
		for (let i = 0; i < Math.min(one.length, two.length); i++) {
			let a = one[i];
			let b = two[i];
			if (a < b) {
				return -1;
			}
			if (a > b) {
				return 1;
			}
		}
		if (one.length < two.length) {
			return -1;
		}
		if (one.length > two.length) {
			return 1;
		}
		return 0;
	}

	static concat(buffers: Array<Uint8Array>): Uint8Array {
		let length = buffers.reduce((sum, buffer) => sum + buffer.length, 0);
		let result = new Uint8Array(length);
		let offset = 0;
		for (let buffer of buffers) {
			result.set(buffer, offset);
			offset += buffer.length;
		}
		return result;
	}
};

export class VarCategory {
	private constructor() {}

	static decode(parser: Parser | Uint8Array, maxBytes: number = 8): number {
		parser = parser instanceof Parser ? parser : new Parser(parser);
		return parser.try((parser) => {
			let value = 0;
			for (let i = 0; i < maxBytes; i++) {
				let byte = parser.unsigned(1);
				let asis = (byte >> 7) & 0x01;
				let cont = (byte >> 6) & 0x01;
				if (asis === 0) {
					let bits = ~byte & 0x3F;
					value = value + bits;
					if (cont === 1) {
						value = value + 1;
						value = 0 - value;
						return value;
					}
					if (i === 0 && bits === 0) {
						throw new Error(`Expected a distinguished encoding!`);
					}
				} else {
					let bits = byte & 0x3F;
					value = value + bits;
					if (cont === 0) {
						return value;
					}
					if (i === 0 && bits === 0) {
						throw new Error(`Expected a distinguished encoding!`);
					}
				}
			}
			throw new Error(`Expected to decode at most ${maxBytes} bytes!`);
		});
	};

	static encode(value: number, maxBytes: number = 8): Uint8Array {
		IntegerAssert.integer(value);
		let bytes = new Array<number>();
		if (value >= 0) {
			do {
				let bits = value > 63 ? 63 : value;
				value = value - bits;
				bytes.push(128 + bits);
			} while (value > 0);
			for (let i = 0; i < bytes.length - 1; i++) {
				bytes[i] += 64;
			}
		} else {
			value = 0 - value;
			value = value - 1;
			do {
				let bits = value > 63 ? 63 : value;
				value = value - bits;
				bytes.push(~bits & 0x3F);
			} while (value > 0);
			bytes[bytes.length - 1] += 64;
		}
		if (bytes.length > maxBytes) {
			throw new Error(`Expected to encode at most ${maxBytes} bytes!`);
		}
		return Uint8Array.from(bytes);
	};
};

export class VarInteger {
	private constructor() {}

	static decode(parser: Parser | Uint8Array, maxBytes: number = 8): number {
		parser = parser instanceof Parser ? parser : new Parser(parser);
		return parser.try((parser) => {
			let value = 0;
			for (let i = 0; i < maxBytes; i++) {
				let byte = parser.unsigned(1);
				let asis = (byte >> 7) & 0x01;
				let cont = (byte >> 6) & 0x01;
				if (asis === 0) {
					let bits = ~byte & 0x3F;
					value = (value * 64) + bits;
					if (cont === 1) {
						value = value + 1;
						value = 0 - value;
						return value;
					}
					if (i === 0 && bits === 0) {
						throw new Error(`Expected a distinguished encoding!`);
					}
				} else {
					let bits = byte & 0x3F;
					value = (value * 64) + bits;
					if (cont === 0) {
						return value;
					}
					if (i === 0 && bits === 0) {
						throw new Error(`Expected a distinguished encoding!`);
					}
				}
			}
			throw new Error(`Expected to decode at most ${maxBytes} bytes!`);
		});
	};

	static encode(value: number, maxBytes: number = 8): Uint8Array {
		IntegerAssert.integer(value);
		let bytes = new Array<number>();
		if (value >= 0) {
			do {
				let bits = value % 64;
				value = Math.floor(value / 64);
				bytes.push(128 + bits);
			} while (value > 0);
			bytes.reverse();
			for (let i = 0; i < bytes.length - 1; i++) {
				bytes[i] += 64;
			}
		} else {
			value = 0 - value;
			value = value - 1;
			do {
				let bits = value % 64;
				value = Math.floor(value / 64);
				bytes.push(128 + ~bits & 0x3F);
			} while (value > 0);
			bytes.reverse();
			bytes[bytes.length - 1] += 64;
		}
		if (bytes.length > maxBytes) {
			throw new Error(`Expected to encode at most ${maxBytes} bytes!`);
		}
		return Uint8Array.from(bytes);
	};
};

export class VarLength {
	private constructor() {}

	static decode(parser: Parser | Uint8Array, maxBytes: number = 8): number {
		parser = parser instanceof Parser ? parser : new Parser(parser);
		return parser.try((parser) => {
			let value = 0;
			for (let i = 0; i < maxBytes; i++) {
				let byte = parser.unsigned(1);
				let cont = (byte >> 7) & 0x01;
				let bits = (byte >> 0) & 0x7F;
				value = (value * 128) + bits;
				if (cont === 0) {
					return value;
				}
				if (i === 0 && bits === 0) {
					throw new Error(`Expected a distinguished encoding!`);
				}
			}
			throw new Error(`Expected to decode at most ${maxBytes} bytes!`);
		});
	};

	static encode(value: number, maxBytes: number = 8): Uint8Array {
		IntegerAssert.atLeast(0, value);
		let bytes = new Array<number>();
		do {
			let bits = value % 128;
			value = Math.floor(value / 128);
			bytes.push(bits);
		} while (value > 0);
		bytes.reverse();
		for (let i = 0; i < bytes.length - 1; i++) {
			bytes[i] += 128;
		}
		if (bytes.length > maxBytes) {
			throw new Error(`Expected to encode at most ${maxBytes} bytes!`);
		}
		return Uint8Array.from(bytes);
	};
};
