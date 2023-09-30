import { CustomError } from "../util/CustomError";
import { Pair } from "./Pair";

/**
* Transaction domain object
*
* This class is a domain object representing a transaction (exchange) between 2 actors of 2 kinds of token
*
* @member pair represents the two kinds of token being exchanged
* @member side buyer or seller
* @member time time of the transaction
* @member size amount of tokens bought or sold
*/
export class Transaction {
    // TODO: add id ? Easy if we have only one source, hard if we have one id that works for every source
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

    /**
    * Create a Transaction
    *
    * @param pair represents the two kinds of token being exchanged
    * @param side buyer or seller
    * @param time time of the transaction
    * @param size amount of tokens bought or sold
    *
    * @returns Valid Transaction
    *
    */
    static try_from(pair: Pair, side: Side, time: number, size: number): Transaction {
        if (size === undefined || size <= 0) {
            throw new TransactionCreationError("Size in not valid");
        }
        if (time === undefined || time < 0) {
            throw new TransactionCreationError("Time is not valid");
        }
        return new Transaction(pair, side, time, size);
    }

    equals(other: Transaction): boolean {
        return this.pair.equals(other.pair) && this.side === other.side && this.size === other.size && this.time === other.time;
    }
}

// TODO: enums in TS are not great, find a better way to do this
/**
* Transaction side
*
* @member Buyer
* @member Seller
*
*/
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
