import { CustomError } from "../util/CustomError";
import { Pair } from "./Pair";

// TODO: add id ? Easy if we have only one source, hard if we have one id that works for every source
export class Transaction {
    public readonly pair: Pair;
    public readonly side: Side;
    public readonly time: number;
    public readonly size: number;

    private constructor(pair: Pair, side: Side, time: number, size: number) {
        this.pair = pair;
        this.side = side;
        this.time = time;
        this.size = size;
    }

    static from(pair: Pair, side: Side, time: number, size: number): Transaction {
        if (time === undefined || time < 0 || size === undefined || size < 0) {
            throw new TransactionCreationError("Arguments are not valid");
        }
        return new Transaction(pair, side, time, size);
    }

    equals(other: Transaction): boolean {
        return this.pair.equals(other.pair) && this.side === other.side && this.size === other.size && this.time === other.time;
    }
}

// TODO: enums in TS are not great, find a better way to do this
export enum Side {
    Buyer,
    Seller,
}

export class TransactionCreationError extends CustomError {
    constructor(message: string, cause?: Error) {
        super(message, cause);

        Object.setPrototypeOf(this, TransactionCreationError.prototype);
    }
}
