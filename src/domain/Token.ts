import { CustomError } from "../util/CustomError";

// TODO: Maybe add a name and an id, at least if we switch to persist Tokens
export class Token {
    public readonly symbol: string;

    private constructor(symbol: string) {
        this.symbol = symbol;
    }

    // TODO: is this UTF-8 ? Is length the right way to count characters ?
    static parse(token: string): Token {
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
