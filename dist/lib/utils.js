"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VarLength = exports.VarInteger = exports.VarCategory = exports.Chunk = exports.IntegerAssert = exports.Parser = void 0;
class Parser {
    buffer;
    offset;
    constructor(buffer, offset) {
        this.buffer = buffer;
        this.offset = offset ?? 0;
    }
    chunk(length) {
        length = length ?? this.buffer.length - this.offset;
        if (this.offset + length > this.buffer.length) {
            throw `Expected to read at least ${length} bytes!`;
        }
        let buffer = this.buffer.slice(this.offset, this.offset + length);
        this.offset += length;
        return buffer;
    }
    eof() {
        return this.offset >= this.buffer.length;
    }
    signed(length, endian) {
        let value = this.unsigned(length, endian);
        let bias = 2 ** (length * 8 - 1);
        if (value >= bias) {
            value -= bias + bias;
        }
        return value;
    }
    try(supplier) {
        let offset = this.offset;
        try {
            return supplier(this);
        }
        catch (error) {
            this.offset = offset;
            throw error;
        }
    }
    tryArray(suppliers) {
        let offset = this.offset;
        for (let supplier of suppliers) {
            try {
                return supplier(this);
            }
            catch (error) {
                this.offset = offset;
            }
        }
        throw `Expected one supplier to succeed!`;
    }
    unsigned(length, endian) {
        IntegerAssert.between(1, length, 6);
        if (this.offset + length > this.buffer.length) {
            throw `Expected to read at least ${length} bytes!`;
        }
        if (endian === "little") {
            let value = 0;
            for (let i = length - 1; i >= 0; i--) {
                value *= 256;
                value += this.buffer[this.offset + i];
            }
            this.offset += length;
            return value;
        }
        else {
            let value = 0;
            for (let i = 0; i < length; i++) {
                value *= 256;
                value += this.buffer[this.offset + i];
            }
            this.offset += length;
            return value;
        }
    }
}
exports.Parser = Parser;
;
class IntegerAssert {
    constructor() { }
    static atLeast(min, value) {
        this.integer(min);
        this.integer(value);
        if (value < min) {
            throw `Expected ${value} to be at least ${min}!`;
        }
        return value;
    }
    static atMost(max, value) {
        this.integer(value);
        this.integer(max);
        if (value > max) {
            throw `Expected ${value} to be at most ${max}!`;
        }
        return value;
    }
    static between(min, value, max) {
        this.integer(min);
        this.integer(value);
        this.integer(max);
        if (value < min || value > max) {
            throw `Expected ${value} to be between ${min} and ${max}!`;
        }
        return value;
    }
    static exactly(value, expected) {
        this.integer(expected);
        this.integer(value);
        if (value !== expected) {
            throw `Expected ${value} to be exactly ${expected}!`;
        }
        return value;
    }
    static integer(value) {
        if (!Number.isInteger(value)) {
            throw `Expected ${value} to be an integer!`;
        }
        return value;
    }
}
exports.IntegerAssert = IntegerAssert;
;
class Chunk {
    constructor() { }
    static fromString(string, encoding) {
        if (encoding === "binary") {
            let bytes = new Array();
            for (let i = 0; i < string.length; i += 1) {
                let byte = string.charCodeAt(i);
                bytes.push(byte);
            }
            return Uint8Array.from(bytes);
        }
        if (encoding === "base64") {
            return Chunk.fromString(atob(string), "binary");
        }
        if (encoding === "base64url") {
            return Chunk.fromString(string.replaceAll("-", "+").replaceAll("_", "/"), "base64");
        }
        if (encoding === "hex") {
            if (string.length % 2 === 1) {
                string = `0${string}`;
            }
            let bytes = new Array();
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
    static toString(chunk, encoding) {
        if (encoding === "binary") {
            let parts = new Array();
            for (let byte of chunk) {
                let part = String.fromCharCode(byte);
                parts.push(part);
            }
            return parts.join("");
        }
        if (encoding === "base64") {
            return btoa(Chunk.toString(chunk, "binary"));
        }
        if (encoding === "base64url") {
            return Chunk.toString(chunk, "base64").replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
        }
        if (encoding === "hex") {
            let parts = new Array();
            for (let byte of chunk) {
                let part = byte.toString(16).toUpperCase().padStart(2, "0");
                parts.push(part);
            }
            return parts.join("");
        }
        // @ts-ignore
        return new TextDecoder().decode(chunk);
    }
    static equals(one, two) {
        return this.comparePrefixes(one, two) === 0;
    }
    static comparePrefixes(one, two) {
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
    static concat(buffers) {
        let length = buffers.reduce((sum, buffer) => sum + buffer.length, 0);
        let result = new Uint8Array(length);
        let offset = 0;
        for (let buffer of buffers) {
            result.set(buffer, offset);
            offset += buffer.length;
        }
        return result;
    }
}
exports.Chunk = Chunk;
;
class VarCategory {
    constructor() { }
    static decode(parser, maxBytes = 8) {
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
                        throw `Expected a distinguished encoding!`;
                    }
                }
                else {
                    let bits = byte & 0x3F;
                    value = value + bits;
                    if (cont === 0) {
                        return value;
                    }
                    if (i === 0 && bits === 0) {
                        throw `Expected a distinguished encoding!`;
                    }
                }
            }
            throw `Expected to decode at most ${maxBytes} bytes!`;
        });
    }
    ;
    static encode(value, maxBytes = 8) {
        IntegerAssert.integer(value);
        let bytes = new Array();
        if (value >= 0) {
            do {
                let bits = value > 63 ? 63 : value;
                value = value - bits;
                bytes.push(128 + bits);
            } while (value > 0);
            for (let i = 0; i < bytes.length - 1; i++) {
                bytes[i] += 64;
            }
        }
        else {
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
            throw `Expected to encode at most ${maxBytes} bytes!`;
        }
        return Uint8Array.from(bytes);
    }
    ;
}
exports.VarCategory = VarCategory;
;
class VarInteger {
    constructor() { }
    static decode(parser, maxBytes = 8) {
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
                        throw `Expected a distinguished encoding!`;
                    }
                }
                else {
                    let bits = byte & 0x3F;
                    value = (value * 64) + bits;
                    if (cont === 0) {
                        return value;
                    }
                    if (i === 0 && bits === 0) {
                        throw `Expected a distinguished encoding!`;
                    }
                }
            }
            throw `Expected to decode at most ${maxBytes} bytes!`;
        });
    }
    ;
    static encode(value, maxBytes = 8) {
        IntegerAssert.integer(value);
        let bytes = new Array();
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
        }
        else {
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
            throw `Expected to encode at most ${maxBytes} bytes!`;
        }
        return Uint8Array.from(bytes);
    }
    ;
}
exports.VarInteger = VarInteger;
;
class VarLength {
    constructor() { }
    static decode(parser, maxBytes = 8) {
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
                    throw `Expected a distinguished encoding!`;
                }
            }
            throw `Expected to decode at most ${maxBytes} bytes!`;
        });
    }
    ;
    static encode(value, maxBytes = 8) {
        IntegerAssert.atLeast(0, value);
        let bytes = new Array();
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
            throw `Expected to encode at most ${maxBytes} bytes!`;
        }
        return Uint8Array.from(bytes);
    }
    ;
}
exports.VarLength = VarLength;
;
