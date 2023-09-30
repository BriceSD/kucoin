import { Pair } from "../src/domain/Pair";
import { Token } from "../src/domain/Token";
import { Side, Transaction } from "../src/domain/Transaction";

export function generatePair(a: string, b: string): Pair{
    let t1 = Token.try_parse(a);
    let t2 = Token.try_parse(b);

    return Pair.try_from(t1, t2);
}

export function generateTransactionWithPair(pair: Pair): Transaction{
    let side = Side.Buyer;
    let size = 1;
    let time = 1;

    return Transaction.try_from(pair, side, time, size);
}
