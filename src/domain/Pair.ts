import { CustomError } from "../util/CustomError";
import { Token } from "./Token";

/**
* Pair domain object
*
* This class represents a domain object containing a pair of trading tokens
*
* @member base Token representing the buyer
* @member quote Token amount representing the seller
*/
export class Pair {
    public readonly base: Token;
    public readonly quote: Token;

    private constructor(base: Token, quote: Token) {
        this.base = base;
        this.quote = quote;
    }

    /**
    * Create a Pair from two Token
    *
    * @param base
    * @param quote
    * @returns Valid Pair
    *
    */
    static from(base: Token, quote: Token): Pair {
        if (base.equals(quote)) {
            throw new PairCreationError("Tokens symbol must be different");
        }
        return new Pair(base, quote);
    }

    equals(pair: Pair): boolean {
        return this.base.equals(pair.base) && this.quote.equals(pair.quote);
    }

    toString(): string {
        return JSON.stringify(this);
    }
}

export class PairCreationError extends CustomError {
    constructor(message: string, cause?: Error) {
        super(message, cause);

        Object.setPrototypeOf(this, PairCreationError.prototype);
    }
}
