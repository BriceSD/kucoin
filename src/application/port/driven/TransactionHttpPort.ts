import { Pair } from "../../../domain/Pair";
import { Transaction } from "../../../domain/Transaction";
import { TransactionPort } from "./TransactionPort";

/**
 * Driven http port that fetch transaction
 */
export interface TransactionHttpPort extends TransactionPort {
    fetch(pair: Pair): Promise<Transaction[]>;
}
