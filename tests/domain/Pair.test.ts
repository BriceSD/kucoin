import { Pair, PairCreationError } from "../../src/domain/Pair";
import { Token } from "../../src/domain/Token";

describe("When building a pairs with the 2 valid different symbols", function() {
    let a = Token.parse("aaaa");
    let b = Token.parse("bbbb");

    let pair = Pair.from(a, b);

    it("should return the pair", function() {
        expect(pair.base.equals(a) && pair.quote.equals(b)).toBe(true);
    });
});
describe("When building a pairs with the same symbols", function() {
    let a = Token.parse("aaaa");
    let b = Token.parse("aaaa");

    it("should throw PairCreationError ", function() {
            expect(() => { Pair.from(a, b) }).toThrow(PairCreationError);
    });
});

describe("When comparing 2 valid pairs with same symbols", function() {
    let a = Token.parse("aaaa");
    let b = Token.parse("bbbb");
    let c = Token.parse("aaaa");
    let d = Token.parse("bbbb");

    let pairA = Pair.from(a, b);
    let pairB = Pair.from(c, d);

    it("should return true", function() {
        expect(pairA.equals(pairB)).toBe(true);
    });
});

describe("When comparing 2 valid pairs with different symbols", function() {
    let a = Token.parse("aaaa");
    let b = Token.parse("bbbb");
    let c = Token.parse("cccc");
    let d = Token.parse("dddd");

    let pairA = Pair.from(a, b);
    let pairB = Pair.from(c, d);

    it("should return false", function() {
        expect(pairA.equals(pairB)).toBe(false);
    });
});
