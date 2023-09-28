import { Delta } from "../../domain/Delta";
import { Pair } from "../../domain/Pair";
import { TransactionBook, TransactionBookCreationError } from "../../domain/TransactionBook";
import { DrivingPort } from "../../domain/port/DrivingPort";
import { HttpPort, HttpPortError } from "../../domain/port/HttpPort";
import { CustomError } from "../../util/CustomError";

/**
 * Application service implementing Driving Port
 */
export class DeltaService implements DrivingPort {

    private transactionRepository: HttpPort;

    constructor(transactionRepository: HttpPort) {
        this.transactionRepository = transactionRepository;
    }

    public async compute(pair: Pair): Promise<Delta> {
        try {
            const transactions = await this.transactionRepository.fetch(pair);
            const transactionBook = TransactionBook.from(pair, transactions);

            return Delta.from(transactionBook);
        } catch (e) {
            if (e instanceof HttpPortError) {
                throw new DeltaServiceError("Something went wrong while fetching transactions for pair : " + pair, e);
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
