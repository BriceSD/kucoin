import { Pair } from "./Pair";
import { Side } from "./Transaction";
import { TransactionBook } from "./TransactionBook";


export class Delta {
    public readonly pair: Pair;
    public readonly amount: number;

    private constructor(pair: Pair, amount: number) {
        this.pair = pair;
        this.amount = amount;
    }

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
}
// book empty => 0
// book with sth => sum

