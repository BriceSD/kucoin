import { IHttpClient } from "../../../src/infrastructure/HttpClient";
import { DrivenPortError } from "../../../src/infrastructure/port/driven/DrivenPortError";
import { KucoinData, KucoinResponse, KucoinTransactionRepository } from "../../../src/infrastructure/repository/KucoinTransactionRepository";
import { generatePair } from "../../utils";

export class StubHttpClient implements IHttpClient {
    response: KucoinResponse;

    get<T>(url: string): Promise<T> {
        return new Promise((resolve, reject) => {
            resolve(this.response as T);
        });
    }
}

describe("When fetching Transaction with invalid data", function() {
    let pair = generatePair("aaaa", "bbbb");
    let client = new StubHttpClient();
    let repository = new KucoinTransactionRepository(client);
    let responses: KucoinResponse[] = [];
    let data: KucoinData[];

    data = []
    data.push(new KucoinData("1", "1", "1", "buy", 28));
    data.push(new KucoinData("99", "a", "a", "a", 28));
    responses.push(new KucoinResponse("200000", data));

    data = []
    data.push(new KucoinData("1", "1", "1", "buy", 28));
    data.push(new KucoinData("99", "1", "1", "a", 28));
    responses.push(new KucoinResponse("200000", data));

    data = []
    data.push(new KucoinData("1", "1", "1", "buy", 28));
    data.push(new KucoinData("99", "1", "a", "buy", 28));
    responses.push(new KucoinResponse("200000", data));
    
    data = []
    data.push(new KucoinData("1", "1", "1", "buy", 28));
    data.push(new KucoinData("99", "1", "a", "buy", 28));
    responses.push(new KucoinResponse("a", data));

    data = []
    data.push(new KucoinData("1", "1", "1", "buy", 28));
    data.push(new KucoinData("99", "1", "1", "buy", 28));
    responses.push(new KucoinResponse("80", data));

    it("should throw DrivenPortError ", async function() {
        responses.map(async (r) => {
            client.response = r;

            await expect(repository.fetch(pair))
                .rejects
                .toThrow(DrivenPortError);
        });
    });
});

describe("When fetching Transaction with valid data", function() {
    let pair = generatePair("aaaa", "bbbb");
    let client = new StubHttpClient();
    let repository = new KucoinTransactionRepository(client);
    let responses: KucoinResponse[] = [];
    let data: KucoinData[];

    data = []
    data.push(new KucoinData("1", "1", "1", "buy", 28));
    data.push(new KucoinData("99", "1", "2", "sell", 28));
    responses.push(new KucoinResponse("200000", data));

    //This is a very special case. As of now we don't use the 'price' parameter
    //Thus we don't check it and it should pass. This behavior could be changed
    //in the future.
    data = []
    data.push(new KucoinData("1", "1", "1", "sell", 28));
    data.push(new KucoinData("99", "a", "1", "buy", 28));
    responses.push(new KucoinResponse("200000", data));

    it("should return a valid list of trasactions ", async function() {
        responses.map(async (r) => {
            client.response = r;

            expect(repository.fetch(pair))
                .toBeTruthy();
        });
    });
});
