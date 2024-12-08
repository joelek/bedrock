import { IntegerAssert } from "@joelek/stdlib/dist/lib/asserts/integer";
import { Chunk } from "@joelek/stdlib/dist/lib/data/chunk";
import { Parser } from "@joelek/stdlib/dist/lib/data/parser";

export { IntegerAssert } from "@joelek/stdlib/dist/lib/asserts/integer";
export { Chunk } from "@joelek/stdlib/dist/lib/data/chunk";
export { Parser } from "@joelek/stdlib/dist/lib/data/parser";

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
