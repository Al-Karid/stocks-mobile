export class StocksTransactionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "StocksTransactionError";
    }
}

export class StocksPortfolioError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "StocksPortfolioError";
    }
}

export class StocksAlertError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "StocksAlertError";
    }
}

export class StockSettingError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "StockSettingError";
    }
}