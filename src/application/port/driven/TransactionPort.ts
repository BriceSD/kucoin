import { Pair } from "../../../domain/Pair";
import { Transaction } from "../../../domain/Transaction";

/**
 * Driven port that fetch transactions
 */
export interface TransactionPort {
    fetch(pair: Pair): Promise<Transaction[]>;
}
