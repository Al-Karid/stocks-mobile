import { Transaction, TransactionRequest } from "@/types/portfolio";
import { dbPromise } from "../db/db";

export const useTransactionRepository = () => {

    const fetchTransactions = async (portfolioId: number, symbol: string): Promise<Transaction[] | []> => {
        try {
            const db = await dbPromise;
            const transactions = await db.getAllAsync<Transaction>("SELECT * FROM transactions WHERE portfolioId = ? AND trim(symbol) = ?", [portfolioId, symbol.trim()]);
            return transactions;
        } catch (error) {
            console.error("‼️ Error fetching transactions:", error);
        }
        return [];
    }

    const insertTransaction = async (transaction: TransactionRequest) => {
        try {
            const db = await dbPromise;
            await db.runAsync("INSERT INTO transactions (portfolioId, symbol, name, type, transactionDate, quantity, pricePerShare, realPricePerShare, totalCost, fees, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [transaction.portfolioId, transaction.symbol.trim(), transaction.name, transaction.type, transaction.transactionDate.toISOString(), transaction.quantity, transaction.pricePerShare, transaction.realPricePerShare, transaction.totalCost, transaction.fees, transaction.notes]
            );
            console.log(`💾 Transaction ${transaction.name} saved successfully into portfolio ${transaction.portfolioId}`);
        } catch (error) {
            console.error("‼️ Error inserting Transaction:", error);
        }
    }

    return {
        fetchTransactions,
        insertTransaction
    }
}