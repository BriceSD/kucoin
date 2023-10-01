import { CustomError } from "../../util/CustomError";
import HttpClient from "../HttpClient";
import { TransactionPort } from "../port/driven/TransactionPort";
import { KucoinTransactionRepository } from "./KucoinTransactionRepository";

/**
 * Transaction repository factory
 * Dynamically creates transaction repositories based on exchange name
 */
export class TransactionRepositoryFactory {
    /**
     * Transaction repository factory
     * Dynamically creates transaction repositories based on exchange name
     */
    static try_from(rawExchange: string): TransactionPort {
        switch (rawExchange.toUpperCase()) {
            case "KUCOIN":
                return new KucoinTransactionRepository(new HttpClient());
            default:
                throw new RepositoryCreationError("Invalid exchange");
        }
    }
}

export class RepositoryCreationError extends CustomError {
    constructor(message: string, cause?: Error) {
        super(message, cause);

        Object.setPrototypeOf(this, RepositoryCreationError.prototype);
    }
}
