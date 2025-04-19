import { Transaction, TransactionRequest } from "@/types/portfolio";
import { useHoldingRepository } from "@/data/repositories/holdingRepository";
import { dbPromise } from "../db/db";

export const useTransactionRepository = () => {

    const { saveOrUpdateHolding } = useHoldingRepository();

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

    const makeTransaction = async (transaction: TransactionRequest) => {
        try {

            const transactions = await fetchTransactions(transaction.portfolioId, transaction.symbol)

            if (transactions.length === 0) {

                /**
                 * If there's no MATCHING transaction
                 * Create a new Holding in the Portfolio
                 */
                console.log("💾 No matching transaction found, creating a new holding");

                await saveOrUpdateHolding({
                    portfolioId: transaction.portfolioId,
                    symbol: transaction.symbol,
                    name: transaction.name,
                    quantity: transaction.quantity,
                    averagePrice: transaction.realPricePerShare,
                    totalCost: transaction.realPricePerShare * transaction.quantity
                })

                // Save new transaction
                await insertTransaction(transaction);
            } else {
                
                /**
                 * If there's at least one MATCHING transaction
                 * Update the existing Holding in the Portfolio
                 * Update :
                 *      - quantity, sum of all transactions
                 *      - averagePrice, weighted average of all transactions
                 *      - totalCost, sum of all transactions
                 *      - averagePrice
                 */
                // Calculate new average price and total cost
                const totalQuantity = transactions.reduce((sum, t) => sum + t.quantity, transaction.quantity);
                const totalCost = transactions.reduce((sum, t) => sum + (t.realPricePerShare * t.quantity), 0) + (transaction.realPricePerShare * transaction.quantity);
                const averagePrice = totalCost / totalQuantity;

                // Save new transaction
                await insertTransaction(transaction);

                // Update existing holding
                await saveOrUpdateHolding({
                    portfolioId: transaction.portfolioId,
                    symbol: transaction.symbol,
                    name: transaction.name,
                    quantity: totalQuantity,
                    averagePrice: averagePrice,
                    totalCost: totalCost
                });
            }

        } catch (error) {
            console.error("‼️ Error inserting Transaction:", error);
        }
    }

    return {
        fetchTransactions,
        insertTransaction,
        saveTransaction: makeTransaction
    }
}