import { TransactionRepositoryFactory, RepositoryCreationError } from "../../../src/infrastructure/repository/TransactionRepositoryFactory";

describe("When creating a transaction repository from factory with invalid name", function() {
    let exchangeNames = ["", "invalid_name"];

    it("should throw DeltaServiceError ", function() {
        exchangeNames.map((exchange) => {
            expect(() => { TransactionRepositoryFactory.try_from(exchange) })
                .toThrow(RepositoryCreationError);
        });
    });
});

describe("When fetching Transaction with valid data", function() {
    let exchangeNames = ["Kucoin", "KUCOIN", "kucoin", "KuCoIn"];

    it("should return a valid list of trasactions ", async function() {
        exchangeNames.map(async (exchange) => {
            expect(TransactionRepositoryFactory.try_from(exchange))
                .toBeTruthy();
        });
    });
});
