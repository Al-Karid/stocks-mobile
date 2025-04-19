import { TransactionRequest, TransactionType } from "@/types/portfolio";
import { useTransactionRepository } from "@/data/repositories/transactionRepository";
import { useHoldingRepository } from "@/data/repositories/holdingRepository";

export const useTransactionService = () => {

    const { saveOrUpdateHolding } = useHoldingRepository();
    const { fetchTransactions, insertTransaction } = useTransactionRepository();
    
    const processTransaction = async (transaction: TransactionRequest, type: TransactionType) => {
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
                 * 1. Update the existing Holding in the Portfolio
                 * Update :
                 *      - quantity, sum of all transactions
                 *      - averagePrice, weighted average of all transactions
                 *      - totalCost, sum of all transactions
                 *      - averagePrice
                 * 2. Save the transaction
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
        processTransaction
    }
}