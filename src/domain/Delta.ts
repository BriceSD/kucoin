import { Pair } from "./Pair";
import { Side } from "./Transaction";
import { TransactionBook } from "./TransactionBook";


/**
* Delta domain object
*
* This class represents a domain object containing the **delta** of transactions for a given pair.
*
* @member pair Token pair 
* @member amount Summed amount of transactions
*
*/
export class Delta {
    public readonly pair: Pair;
    public readonly amount: number;

    private constructor(pair: Pair, amount: number) {
        this.pair = pair;
        this.amount = amount;
    }

    /**
    * Create a Delta from a TransactionBook
    *
    * @param book The TransactionBook
    * @returns Valid Delta object 
    *
    */
    static from(book: TransactionBook): Delta {
        const amount: number = book.transactions.reduce((acc, curr) => {
            switch (curr.side) {
                case Side.Buyer:
                    return acc + curr.size;
                case Side.Seller:
                    return acc - curr.size;
            }
        }, 0.0 as number);

        return new Delta(book.pair, amount);
    }

    toString(): string {
        return JSON.stringify(this);
    }
}

