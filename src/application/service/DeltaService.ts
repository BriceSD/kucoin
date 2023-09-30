import { Delta } from "../../domain/Delta";
import { Pair } from "../../domain/Pair";
import { TransactionBook, TransactionBookCreationError } from "../../domain/TransactionBook";
import { DrivenPortError } from "../../infrastructure/port/driven/DrivenPortError";
import { TransactionPort } from "../../infrastructure/port/driven/TransactionPort";
import { CustomError } from "../../util/CustomError";
import { DeltaPort } from "../port/driving/DeltaPort";

/**
 * Application service implementing Driving Port
 * Enable router to access Deltas
 */
export class DeltaService implements DeltaPort {

    private transactionRepository: TransactionPort;

    constructor(transactionRepository: TransactionPort) {
        this.transactionRepository = transactionRepository;
    }

    /**
     * Compute Delta for a given Pair
     * 
     *@param pair 
     *
     * @returns promise containing a Delta object
     */
    public async compute(pair: Pair): Promise<Delta> {
        try {
            const transactions = await this.transactionRepository.fetch(pair);
            const book = TransactionBook.try_from(pair, transactions);

            return Delta.from(book);
        } catch (e) {
            if (e instanceof DrivenPortError) {
                throw new DeltaServiceError("Something went wrong while fetching external data for pair : " + pair, e);
            }
            else if (e instanceof TransactionBookCreationError) {
                throw new DeltaServiceError("Something went wrong while creating transactions book for pair : " + pair, e);
            }
            else {
                throw new DeltaServiceError("Something went wrong while processing pair : " + pair);
            }
        }
    }
}

export class DeltaServiceError extends CustomError {
    constructor(message: string, cause?: Error) {
        super(message, cause);

        Object.setPrototypeOf(this, DeltaServiceError.prototype);
    }
}
