import { Token, TokenParseError } from "../../src/domain/Token";

describe("When parsing a token too short", function() {
    let rawTokens = ["", "a"];

    it("should throw TokenParseError ", function() {
        rawTokens.map((t) => {
            expect(() => { Token.parse(t) }).toThrow(TokenParseError);
        });
    });
});

describe("When parsing a token too long", function() {
    let rawTokens = ["aeihain", "haaoaueqhaehaeidnhttaei"];

    it("should throw TokenParseError ", function() {
        rawTokens.map((t) => {
            expect(() => { Token.parse(t) }).toThrow(TokenParseError);
        });
    });
});

describe("When parsing a token that contains invalid character", function() {
    let rawTokens = ["t S", "   ", " t t", "n/et", "\\mel", "&aenn"];

    it("should throw TokenParseError ", function() {
        rawTokens.map((t) => {
            expect(() => { Token.parse(t) }).toThrow(TokenParseError);
        });
    });
});

describe("When parsing a token that contains numbers", function() {
    let rawTokens = ["a1a", "2222", "1a1"];

    it("should throw TokenParseError ", function() {
        rawTokens.map((t) => {
            expect(() => { Token.parse(t) }).toThrow(TokenParseError);
        });
    });
});

describe("When parsing a valid token", function() {
    let rawToken = "taS";

    it("should return the token in capital letters", function() {
    let t = Token.parse(rawToken);
        expect(t?.symbol).toEqual(rawToken.toUpperCase());
    });
});

describe("When comparing 2 valid token with the same symbol", function() {
    let a = Token.parse("aeae");
    let b = Token.parse("aeae");

    it("should return true", function() {
        expect(a?.equals(b)).toBe(true);
    });
});

describe("When comparing 2 valid token with different symbol", function() {
    let a = Token.parse("aaaa");
    let b = Token.parse("bbbb");

    it("should return false", function() {
        expect(a?.equals(b)).toBe(false);
    });
});
