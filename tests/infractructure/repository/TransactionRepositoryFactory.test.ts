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

describe("When creating a transaction repository with a valid name", function() {
    let exchangeNames = ["Kucoin", "KUCOIN", "kucoin", "KuCoIn"];

    it("should return the transaction repository ", async function() {
        exchangeNames.map(async (exchange) => {
            expect(TransactionRepositoryFactory.try_from(exchange))
                .toBeTruthy();
        });
    });
});
