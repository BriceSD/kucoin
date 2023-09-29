import { CustomError } from "../util/CustomError";

/**
* Token domain object
*
* This class represents a domain object representing a token
*
* @member symbol The symbol used in exchanges to represent the token
*/
export class Token {
// TODO: Maybe add a name and an id, at least if we switch to persist Tokens
    public readonly symbol: string;

    private constructor(symbol: string) {
        this.symbol = symbol;
    }

    /**
    * Create a Token from a string
    *
    * @param string
    * @returns Valid Token
    *
    */
    static parse(token: string): Token {
    // TODO: is this UTF-8 ? Is length the right way to count characters ?
        if (token === undefined || token.length < 2 || token.length > 6 || (/[^a-zA-Z]/.test(token))) {
            throw new TokenParseError("Invalid symbol");
        }
        return new Token(token.toUpperCase());
    }

    equals(token: Token): boolean {
        return this.symbol === token.symbol;
    }

    toString(): string {
        return JSON.stringify(this);
    }
}

export class TokenParseError extends CustomError {
    constructor(message: string, cause?: Error) {
        super(message, cause);

        Object.setPrototypeOf(this, TokenParseError.prototype);
    }
}
