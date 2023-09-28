import { CustomError } from "../../util/CustomError";
import { Pair } from "../Pair";
import { TokenParseError } from "../Token";
import { Transaction } from "../Transaction";

/**
 * Driven Port
 */
export interface HttpPort {

    fetch(pair: Pair): Promise<Transaction[]>;
}

export class HttpPortError extends CustomError {
    constructor(message: string, cause?: Error) {
        super(message, cause);

        Object.setPrototypeOf(this, TokenParseError.prototype);
    }
}
