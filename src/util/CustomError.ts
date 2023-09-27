export class CustomError extends Error {
    cause: Error | undefined;

    constructor(message: string, cause?: Error) {
        super(message);
        this.cause = cause;

        Object.setPrototypeOf(this, CustomError.prototype);
    }

    getErrorMessages() {
        let message: string[] = [];
        message.push("Error: " + this.message);
        let error = this as CustomError;

        while (error.cause !== undefined && error.cause instanceof CustomError) {
            error = error.cause;
            message.push("Caused by:\n\t" +error.message)
        }
        
        if(error.cause !== undefined){
            message.push("Caused by:\n\t" +error.cause.message)
        }

        return message.join('\n')
    }
}

