export class StocksTransactionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "StocksTransactionError";
    }
}