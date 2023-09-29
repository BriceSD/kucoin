import { Pair } from "../../src/domain/Pair";
import { Side, Transaction, TransactionCreationError } from "../../src/domain/Transaction";
import { generatePair } from "../utils";

describe("When building a transaction with negative time/size or size of 0", function() {
    let pair = generatePair("aaaa", "bbbb");

    let rawTransactions: [Pair, Side, number, number][] = [
        [pair, Side.Buyer, -1, -1],
        [pair, Side.Seller, -1, 88],
        [pair, Side.Seller, 89, -1],
        [pair, Side.Seller, 89, 0]
    ];

    it("should throw TransactionCreationError ", function() {
        rawTransactions.map((t) => {
            expect(() => { Transaction.from(t[0], t[1], t[2], t[3]) }).toThrow(TransactionCreationError);
        });
    });
});

describe("When building a transaction with valid arguments", function() {
    let pair = generatePair("aaaa", "bbbb");

    let rawTransactions: [Pair, Side, number, number][] = [[pair, Side.Buyer, 1, 1], [pair, Side.Seller, 1, 88], [pair, Side.Seller, 89, 1]];

    it("should build the transaction", function() {
        rawTransactions.map((t) => {
            expect(Transaction.from(t[0], t[1], t[2], t[3]).pair).toEqual(t[0]);
            expect(Transaction.from(t[0], t[1], t[2], t[3]).side).toEqual(t[1]);
            expect(Transaction.from(t[0], t[1], t[2], t[3]).time).toEqual(t[2]);
            expect(Transaction.from(t[0], t[1], t[2], t[3]).size).toEqual(t[3]);
        });
    });
});
