import { DrivenPortError } from "../../../src/application/port/driven/DrivenPortError";
import { TransactionHttpPort } from "../../../src/application/port/driven/TransactionHttpPort";
import { DeltaService } from "../../../src/application/service/DeltaService";
import { Pair } from "../../../src/domain/Pair";
import { Side, Transaction } from "../../../src/domain/Transaction";
import { generatePair } from "../../utils";

export class ValidStubTransactionRepository implements TransactionHttpPort {
    transactions;
    fetch(pair: Pair): Promise<Transaction[]> {
        return new Promise((resolve, reject) => {
            resolve(this.transactions);
        });
    }
}

// TODO: test if the service correctly handles thrown errors

describe("When computing delta from service", function() {
    let a = 10;
    let b = 2;
    let pair = generatePair("aaaa", "bbbb");
    let transactions: Transaction[] = [];
    transactions.push(Transaction.from(pair, Side.Buyer, 1, a));
    transactions.push(Transaction.from(pair, Side.Seller, 1, b));
    transactions.push(Transaction.from(pair, Side.Buyer, 1, a));

    let repository = new ValidStubTransactionRepository();
    repository.transactions = transactions;

    let deltaService = new DeltaService(repository);
    it("should return a delta of sum of transactions", async function() {
        let delta = await deltaService.compute(pair);
        expect(delta.amount).toEqual(a - b + a);
    });
});

describe("When computing delta from service with 0 transaction", function() {
    let pair = generatePair("aaaa", "bbbb");

    let repository = new ValidStubTransactionRepository();
    repository.transactions = [];

    let deltaService = new DeltaService(repository);
    it("should return 0", async function() {
        let delta = await deltaService.compute(pair);
        expect(delta.amount).toEqual(0);
    });
});
