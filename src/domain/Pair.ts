import { CustomError } from "../util/CustomError";
import { Token } from "./Token";

export class Pair {
    public readonly base: Token;
    public readonly quote: Token;

    private constructor(base: Token, quote: Token) {
        this.base = base;
        this.quote = quote;
    }

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
