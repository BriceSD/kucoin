import { Delta } from "../../src/domain/Delta";
import { Side, Transaction } from "../../src/domain/Transaction";
import { TransactionBook } from "../../src/domain/TransactionBook";
import { generatePair } from "../utils";

describe("When computing delta from an empty book", function() {
    let pair = generatePair("aaaa", "bbbb");
    let book = TransactionBook.from(pair, []);

    it("should return a delta of 0", function() {
        expect(Delta.from(book).amount).toEqual(0);
    });
});

describe("When building a transaction book with a wrong pair", function() {
    let a = 10;
    let b = 2;
    let pair = generatePair("aaaa", "bbbb");
    let transactions: Transaction[] = [];
    transactions.push(Transaction.from(pair, Side.Buyer, 1, a));
    transactions.push(Transaction.from(pair, Side.Seller, 1, b));
    transactions.push(Transaction.from(pair, Side.Buyer, 1, a));

    let book = TransactionBook.from(pair, transactions);

    it("should return a delta of sum of transactions", function() {
        expect(Delta.from(book).amount).toEqual(a-b+a);
    });
});
