import { Pair } from "../../domain/Pair";
import { Side, Transaction, TransactionCreationError } from "../../domain/Transaction";
import { TransactionBookCreationError } from "../../domain/TransactionBook";
import { IHttpClient } from "../HttpClient";
import { DrivenPortError } from "../port/driven/DrivenPortError";
import { TransactionPort } from "../port/driven/TransactionPort";

/**
 * Transaction repository implementing Driven Port
 */
export class KucoinTransactionRepository implements TransactionPort {
    readonly http: IHttpClient;


    constructor(httpClient: IHttpClient) {
        this.http = httpClient;
    }

    /**
     * Fetch transactions from Kucoin
     *
     * @param pair Tokens to look for 
     *
     * @returns transaction list
     */
    async fetch(pair: Pair): Promise<Transaction[]> {
        try {
            const url = `https://api.kucoin.com/api/v1/market/histories?symbol=${pair.base.symbol}-${pair.quote.symbol}`;
            const response = await this.http.get<KucoinResponse>(url);

            return this.parse(response, pair);
        } catch (e) {
            if (e instanceof TransactionBookCreationError) {
                throw new DrivenPortError("Failed to create a transaction book", e);
            }
            else if (e instanceof TransactionCreationError) {
                throw new DrivenPortError("Failed to create a transaction", e);
            }
            else if (e instanceof DrivenPortError) {
                throw new DrivenPortError("Failed to fetch transactions", e);
            }

            throw new DrivenPortError("Failed to fetch transactions");
        }
    }

    /**
     * Parse an AxiosResponse from Kucoin histories endpoint into transactions
     *
     * @param pair Requested pair transaction
     */
    private parse(response: KucoinResponse, pair: Pair): Transaction[] {
        const expectedStatus = "200000";
        const status = response.code;
        const rawTransactions = response.data;

        if (status !== expectedStatus) {
            throw new DrivenPortError("Wrong result code from Kucoin, actual : " + status + " expected : " + expectedStatus);
        }

        return rawTransactions.map((t: KucoinData) => {
            const time: number = Number(t?.time);
            const size: number = Number(t?.size);

            if (time === undefined || isNaN(time)) {
                throw new DrivenPortError("Failed to parse time");
            }
            if (size === undefined || isNaN(size)) {
                throw new DrivenPortError("Failed to parse size");
            }


            const rawSide: string = t?.side;
            let side: Side;
            if (rawSide === "buy") {
                side = Side.Buyer;
            } else if (rawSide === "sell") {
                side = Side.Seller
            } else {
                throw new DrivenPortError("Failed to parse side");
            }

            return Transaction.try_from(pair, side, time, size);
        });

    }
}

/**
 * Expected response from API call https://docs.kucoin.com/#get-trade-histories
 *
 * @member code Represents the internal status code of the request. ***IT'S A STRING, NOT A NUMBER***
 * @member data Represents transactions
 *
 * `
   {
      "code": "200000",
      "data": [
          {
              "sequence": "1545896668571",
              "price": "0.07",                      //Filled price
              "size": "0.004",                      //Filled amount
              "side": "buy",                        //Filled side. The filled side is set to the taker by default.
              "time": 1545904567062140823           //Transaction time
          },
          {
              "sequence": "1545896668578",
              "price": "0.054",
              "size": "0.066",
              "side": "buy",
              "time": 1545904581619888405
          }
      ]
   }
   `
 */
export class KucoinResponse {
    code: string;
    data: KucoinData[];

    constructor(code: string, data: KucoinData[]) {
        this.code = code;
        this.data = data;
    }
}


/**
 * Transaction data response from API call https://docs.kucoin.com/#get-trade-histories
 *
 * @member sequence Represents the sequence number of the transaction. ***IT'S A STRING, NOT A NUMBER***
 * @member price Price to exchange 1 base token for quoted token
 * @member size Amount of based token exchanged
 * @member side Does the transaction represent a buy or a sell
 * @member time Time of the transaction in ***UNIX time***
 *
 * `
          {
              "sequence": "1545896668571",
              "price": "0.07",                      //Filled price
              "size": "0.004",                      //Filled amount
              "side": "buy",                        //Filled side. The filled side is set to the taker by default.
              "time": 1545904567062140823           //Transaction time
          },
 `
 */
export class KucoinData {
    sequence: string;
    price: string;
    size: string;
    side: string;
    time: number;

    constructor(sequence: string, price: string, size: string, side: string, time: number) {
        this.sequence = sequence;
        this.price = price;
        this.size = size;
        this.side = side;
        this.time = time;
    }
}

