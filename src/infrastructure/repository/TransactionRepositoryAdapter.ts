import { DrivenPortError } from "../../application/port/driven/DrivenPortError";
import { TransactionHttpPort } from "../../application/port/driven/TransactionHttpPort";
import { Pair } from "../../domain/Pair";
import { Side, Transaction, TransactionCreationError } from "../../domain/Transaction";
import { TransactionBookCreationError } from "../../domain/TransactionBook";
import axios, { AxiosResponse } from "axios";

/**
 * Transaction repository implementing Driven Port
 */
export class TransactionRepositoryAdapter implements TransactionHttpPort {
/**
 * Fetch transactions from Kucoin
 *
 * @param pair Tokens to look for 
 *
 * @returns transactions, can fail and throw errors
 */
    async fetch(pair: Pair): Promise<Transaction[]> {
        try {
            const url = `https://api.kucoin.com/api/v1/market/histories?symbol=${pair.base.symbol}-${pair.quote.symbol}`;
            const response = await axios.get(url);

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
     *
     * Parse an AxiosResponse from Kucoin histories endpoint into transactions
     *
     * @param response Expected response from API call {@link  https://docs.kucoin.com/#get-trade-histories}
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
     *
     * @param pair Requested pair transaction
     */
    private parse(response: AxiosResponse<any, any>, pair: Pair): Transaction[] {
        const expectedStatusCode = 200000;

        const statusCode: number = Number(response.data.code);
        const rawTransactions = response.data.data;

        if (statusCode !== expectedStatusCode) {
            throw new DrivenPortError("Wrong result code from Kucoin, actual : " + statusCode + " expected : " + expectedStatusCode);
        }

        return rawTransactions.map((t: any) => {
            const rawSide: string = t?.side;
            const time: number = Number(t?.time);
            const size: number = Number(t?.size);


            let side: Side;
            if (rawSide === "buy") {
                side = Side.Buyer;
            } else if (rawSide === "sell") {
                side = Side.Seller
            } else {
                throw new DrivenPortError("Failed to parse side");
            }

            return Transaction.from(pair, side, time, size);
        });

    }
}
