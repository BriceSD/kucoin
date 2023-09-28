import { Pair } from "../../domain/Pair";
import { Side, Transaction, TransactionCreationError } from "../../domain/Transaction";
import { TransactionBookCreationError } from "../../domain/TransactionBook";
import { HttpPort, HttpPortError } from "../../domain/port/HttpPort";
import axios from "axios";

/**
 * Order repository implementing Driven Port
 */
export class TransactionRepositoryAdapter implements HttpPort {
    async fetch(pair: Pair): Promise<Transaction[]> {
        // Expected response from API call (see : https://docs.kucoin.com/#get-trade-histories)
        // {
        // "code": "200000",
        // "data": [
        //     {
        //         "sequence": "1545896668571",
        //         "price": "0.07",                      //Filled price
        //         "size": "0.004",                      //Filled amount
        //         "side": "buy",                        //Filled side. The filled side is set to the taker by default.
        //         "time": 1545904567062140823           //Transaction time
        //     },
        //     {
        //         "sequence": "1545896668578",
        //         "price": "0.054",
        //         "size": "0.066",
        //         "side": "buy",
        //         "time": 1545904581619888405
        //     }
        // ]
        // }

        const expectedStatusCode = 200000;
        try {
            let url = `https://api.kucoin.com/api/v1/market/histories?symbol=${pair.base.symbol}-${pair.quote.symbol}`;
            const result = await axios.get(url);

            const statusCode: number = Number(result.data.code);
            const rawTransactions = result.data.data;

            if (statusCode !== expectedStatusCode) {
                throw new HttpPortError("Wrong result code from partner, actual : " + statusCode + " expected : " + expectedStatusCode);
            }

            const transactions: Transaction[] = rawTransactions.map((t: any) => {
                const rawSide: string = t?.side;
                const time: number = Number(t?.time);
                const size: number = Number(t?.size);


                let side: Side;
                if (rawSide === "buy") {
                    side = Side.Buyer;
                } else if (rawSide === "sell") {
                    side = Side.Seller
                } else {
                    throw new HttpPortError("Failed to parse side");
                }

                return Transaction.from(pair, side, time, size);
            });

            return transactions;
        } catch (e) {
            if(e instanceof TransactionBookCreationError){
                throw new HttpPortError("Failed to build a transaction book", e);
            }
            else if(e instanceof TransactionCreationError){
                throw new HttpPortError("Failed to build a transaction", e);
            }
            throw new HttpPortError("Failed to fetch transactions");
        }
    }
}
