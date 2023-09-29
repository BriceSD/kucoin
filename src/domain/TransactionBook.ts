import { CustomError } from "../util/CustomError";
import { Pair } from "./Pair";
import { Transaction } from "./Transaction";

export class TransactionBook {
    public readonly pair: Pair;
    public readonly transactions: Transaction[];

    private constructor(pair: Pair, transactions: Transaction[]) {
        this.transactions = transactions;
        this.pair = pair;
    }

    static from(pair: Pair, transactions: Transaction[]): TransactionBook {
        const len = transactions.filter((t) => t.pair?.equals(pair)).length;

        if (len !== transactions.length) {
            throw new TransactionBookCreationError("At least one transaction isn't of given pair");
        }

        return new TransactionBook(pair, transactions);
    }
}


export class TransactionBookCreationError extends CustomError {
    constructor(message: string, cause?: Error) {
        super(message, cause);

        Object.setPrototypeOf(this, TransactionBookCreationError.prototype);
    }
}
