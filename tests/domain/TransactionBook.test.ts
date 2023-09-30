import { Transaction } from "../../src/domain/Transaction";
import { TransactionBook, TransactionBookCreationError } from "../../src/domain/TransactionBook";
import { generatePair, generateTransactionWithPair } from "../utils";

describe("When creating a transaction book with no transaction", function() {
    let pair = generatePair("aaaa", "bbbb");

    let transactions: Transaction[] = [];

    it("should create the transaction book", function() {
        expect(TransactionBook.try_from(pair, transactions)).toBeTruthy();
    });
});

describe("When creating a transaction book with same pair", function() {
    let pair = generatePair("aaaa", "bbbb");
    let transaction1 = generateTransactionWithPair(pair);
    let transaction2 = generateTransactionWithPair(pair);

    let transactions: Transaction[] = [transaction1, transaction2];

    it("should create the transaction book", function() {
        expect(TransactionBook.try_from(pair, transactions)).toBeTruthy();
    });
});

describe("When building a transaction book with a different pair", function() {
    let pair = generatePair("aaaa", "bbbb");
    let differentPair = generatePair("aaaa", "cccc");
    let transaction1 = generateTransactionWithPair(pair);
    let transaction2 = generateTransactionWithPair(pair);

    let transactions: Transaction[] = [transaction1, transaction2];

    it("should throw TransactionBookCreationError ", function() {
        expect(() => { TransactionBook.try_from(differentPair, transactions) }).toThrow(TransactionBookCreationError);
    });
});

describe("When building a transaction book with transactions made of more than one pair", function() {
    let pair1 = generatePair("aaaa", "bbbb");
    let pair2 = generatePair("aaaa", "cccc");
    let transaction1 = generateTransactionWithPair(pair1);
    let transaction2 = generateTransactionWithPair(pair2);

    let transactions: Transaction[] = [transaction1, transaction2];

    it("should throw TransactionBookCreationError ", function() {
        expect(() => { TransactionBook.try_from(pair1, transactions) }).toThrow(TransactionBookCreationError);
    });
});
