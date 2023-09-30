import { Pair, PairCreationError } from "../../src/domain/Pair";
import { Token } from "../../src/domain/Token";

describe("When building a pairs with the 2 valid different symbols", function() {
    let a = Token.try_parse("aaaa");
    let b = Token.try_parse("bbbb");

    let pair = Pair.try_from(a, b);

    it("should return the pair", function() {
        expect(pair.base.equals(a) && pair.quote.equals(b)).toBe(true);
    });
});
describe("When building a pairs with the same symbols", function() {
    let a = Token.try_parse("aaaa");
    let b = Token.try_parse("aaaa");

    it("should throw PairCreationError ", function() {
            expect(() => { Pair.try_from(a, b) }).toThrow(PairCreationError);
    });
});

describe("When comparing 2 valid pairs with same symbols", function() {
    let a = Token.try_parse("aaaa");
    let b = Token.try_parse("bbbb");
    let c = Token.try_parse("aaaa");
    let d = Token.try_parse("bbbb");

    let pairA = Pair.try_from(a, b);
    let pairB = Pair.try_from(c, d);

    it("should return true", function() {
        expect(pairA.equals(pairB)).toBe(true);
    });
});

describe("When comparing 2 valid pairs with different symbols", function() {
    let a = Token.try_parse("aaaa");
    let b = Token.try_parse("bbbb");
    let c = Token.try_parse("cccc");
    let d = Token.try_parse("dddd");

    let pairA = Pair.try_from(a, b);
    let pairB = Pair.try_from(c, d);

    it("should return false", function() {
        expect(pairA.equals(pairB)).toBe(false);
    });
});
