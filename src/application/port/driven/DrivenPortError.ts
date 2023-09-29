import { CustomError } from "../../../util/CustomError";

/**
 * Error indicating that something went wrong while trying to 
 * access a service outside the application
 */
export class DrivenPortError extends CustomError {
    constructor(message: string, cause?: Error) {
        super(message, cause);

        Object.setPrototypeOf(this, DrivenPortError.prototype);
    }
}
