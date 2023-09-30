import { TransactionPort } from "../../../src/application/port/driven/TransactionPort";
import { DeltaService, DeltaServiceError } from "../../../src/application/service/DeltaService";
import { Pair } from "../../../src/domain/Pair";
import { Side, Transaction } from "../../../src/domain/Transaction";
import { generatePair } from "../../utils";
import { KucoinData, KucoinResponse, KucoinTransactionRepository } from "../../../src/infrastructure/repository/KucoinTransactionRepository";
import { IHttpClient } from "../../../src/infrastructure/HttpClient";

export class ValidStubTransactionRepository implements TransactionPort {
    transactions: Transaction[];
    fetch(pair: Pair): Promise<Transaction[]> {
        return new Promise((resolve, reject) => {
            resolve(this.transactions);
        });
    }
}

export class StubHttpClient implements IHttpClient {
    response: KucoinResponse;

    get<T>(url: string): Promise<T> {
        return new Promise((resolve, reject) => {
            resolve(this.response as T);
        });
    }
}

describe("Given valid delta service", function() {
    describe("When computing delta with invalid transactions from external API", function() {
        let pair = generatePair("aaaa", "bbbb");
        let client = new StubHttpClient();
        let repository = new KucoinTransactionRepository(client);
        let deltaService = new DeltaService(repository);

        let data: KucoinData[] = []
        data.push(new KucoinData("1", "1", "1", "buy", 28));
        data.push(new KucoinData("99", "a", "a", "a", 28));

        client.response = new KucoinResponse("200000", data);

        it("should throw DeltaServiceError ", async function() {
            await expect(deltaService.compute(pair))
                .rejects
                .toThrow(DeltaServiceError);
        });
    });
});

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
