import { Transaction } from "../../src/domain/Transaction";
import { TransactionBook, TransactionBookCreationError } from "../../src/domain/TransactionBook";
import { generatePair, generateTransactionWithPair } from "../utils";

describe("When creating a transaction book with one type of pair", function() {
    let pair = generatePair("aaaa", "bbbb");
    let transaction1 = generateTransactionWithPair(pair);
    let transaction2 = generateTransactionWithPair(pair);

    let transactions: Transaction[] = [transaction1, transaction2];

    it("should create the transaction book", function() {
        expect(TransactionBook.from(pair, transactions)).toBeTruthy();
    });
});

describe("When building a transaction book with a wrong pair", function() {
    let pair = generatePair("aaaa", "bbbb");
    let wrongPair = generatePair("aaaa", "cccc");
    let transaction1 = generateTransactionWithPair(pair);
    let transaction2 = generateTransactionWithPair(pair);

    let transactions: Transaction[] = [transaction1, transaction2];

    it("should throw TransactionBookCreationError ", function() {
        expect(() => { TransactionBook.from(wrongPair, transactions) }).toThrow(TransactionBookCreationError);
    });
});

describe("When building a transaction book with a more than one pair", function() {
    let pair1 = generatePair("aaaa", "bbbb");
    let pair2 = generatePair("aaaa", "cccc");
    let transaction1 = generateTransactionWithPair(pair1);
    let transaction2 = generateTransactionWithPair(pair2);

    let transactions: Transaction[] = [transaction1, transaction2];

    it("should throw TransactionBookCreationError ", function() {
        expect(() => { TransactionBook.from(pair1, transactions) }).toThrow(TransactionBookCreationError);
    });
});
