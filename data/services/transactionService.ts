import { TransactionRequest, TransactionType } from "@/types/portfolio";
import { useTransactionRepository } from "@/data/repositories/transactionRepository";
import { useHoldingRepository } from "@/data/repositories/holdingRepository";
import { StocksTransactionError } from "@/types/errors";

export const useTransactionService = () => {

    const { saveOrUpdateHolding, findHolding, updateHolding } = useHoldingRepository();
    const { fetchTransactions, insertTransaction } = useTransactionRepository();

    /**
     * Process a transaction
     * @param transaction TransactionRequest
     * @returns Promise<void>
     */
    const processTransaction = async (transaction: TransactionRequest) => {
        
        try {

            const transactions = await fetchTransactions(transaction.portfolioId, transaction.symbol)

            if (transactions.length === 0) {

                if (transaction.type === "SELL") {
                    throw new StocksTransactionError("‼️ No matching holding found, cannot sell");
                }

                /**
                 * If there's no matching transaction
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
                * If there's at least one matching transaction
                * Update the existing Holding in the Portfolio
                * Update :
                *      - quantity, sum of all transactions
                *      - averagePrice, weighted average of all transactions
                *      - totalCost, sum of all transactions
                *      - averagePrice
                */

                const holding = await findHolding(transaction.symbol, transaction.portfolioId);
                if (!holding) {
                    throw new StocksTransactionError("‼️ Holding not found, cannot update");
                }
                if (transaction.type === "SELL" && holding.quantity < Math.abs(transaction.quantity)) {
                    throw new StocksTransactionError("‼️ Not enough shares to sell");
                }

                // Update quantity
                holding.quantity += transaction.quantity;

                // Update total cost correctly
                if (transaction.type === "SELL") {
                    const sellCost = holding.averagePrice * Math.abs(transaction.quantity);
                    holding.totalCost -= sellCost;
                } else {
                    holding.totalCost += transaction.totalCost;
                }

                // Recalculate average price
                const averagePrice = holding.totalCost / holding.quantity;
                holding.averagePrice = isNaN(averagePrice) ? 0 : averagePrice;

                // Save new transaction
                await insertTransaction(transaction);
                await updateHolding(holding);
            }

        } catch (error: any) {
            if (error instanceof StocksTransactionError) {
                throw new Error(error.message);
            } else {
                console.error("‼️ Error inserting Transaction:", error);
            }
        }
    }

    return {
        processTransaction
    }
}