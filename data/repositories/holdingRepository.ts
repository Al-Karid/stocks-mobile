import { Holding } from "@/types/portfolio";
import { dbPromise } from "@/data/providers/sqlite"
import { HoldingRequest } from "@/types/portfolio";
import { useStockRepository } from "@/data/repositories/stockRepository";

export const useHoldingRepository = () => {

    const { findStock } = useStockRepository();

    /**
     * Fetch a holding by its symbol and portfolioId
     * @param symbol 
     * @param portfolioId 
     * @returns 
     */
    const findHolding = async (symbol: string, portfolioId: number): Promise<Holding | null> => {
        try {
            const db = await dbPromise;
            const holding = await db.getFirstAsync<Holding>("SELECT * FROM holdings WHERE portfolioId = ? AND trim(symbol) = ?", [portfolioId, symbol.trim()]);
            return holding;
        } catch (error) {
            console.error("‼️ Error fetching holding:", error);
        }
        return null;
    }

    /**
     * Save or update a holding in the database
     * @param holding 
     */
    const saveOrUpdateHolding = async (holding: HoldingRequest) => {
        try {
            const db = await dbPromise;
            await db.runAsync("INSERT OR REPLACE INTO holdings (portfolioId, symbol, name, quantity, averagePrice, totalCost) VALUES (?, ?, ?, ?, ?, ?)",
                [holding.portfolioId!, holding.symbol.trim(), holding.name, holding.quantity, holding.averagePrice, holding.totalCost!]
            );
            console.log(`💾 Holding ${holding.name} saved successfully into portfolio ${holding.portfolioId}`);
            console.log("💾 Holding saved successfully:", holding);
            
        } catch (error) {
            console.error("‼️ Error inserting Holding:", error);   
        }
    }

    /**
     * Update a holding in the database
     * @param holding 
     */
    const updateHolding = async (holding: HoldingRequest) => {
        try {
            const db = await dbPromise;
            await db.runAsync("UPDATE holdings SET quantity = ?, averagePrice = ?, totalCost = ? WHERE portfolioId = ? AND symbol = ?",
                [holding.quantity, holding.averagePrice, holding.totalCost!, holding.portfolioId, holding.symbol]
            );
            console.log(`💾 Holding ${holding.name} updated successfully in portfolio ${holding.portfolioId}`);
        } catch (error) {
            console.error("‼️ Error updating Holding:", error);
            console.error("‼️ Error updating Holding:", holding);
        }
    }

    /**
     * Fetch all holdings for a given portfolio.
     * @param portfolioId 
     * @returns only holdings with quantity > 0
     */
    const fetchHoldings = async (portfolioId: number) => {
        const db = await dbPromise;
        const holdings = await db.getAllAsync<Holding>("SELECT * FROM holdings WHERE portfolioId = ?", [portfolioId]);
        for (const holding of holdings) {
            const stock = await findStock(holding.symbol);
            holding.currentPrice = stock?.currentPrice || 0;
            holding.gainLoss = (holding.currentPrice - holding.averagePrice) * holding.quantity;
        }
        return holdings.filter(holding => holding.quantity > 0);
    }

    /**
     * Delete a holding and all its associated transactions
     * @param portfolioId
     * @param symbol
     */
    const deleteHolding = async (portfolioId: number, symbol: string) => {
        try {
            const db = await dbPromise;
            await db.runAsync("DELETE FROM transactions WHERE portfolioId = ? AND trim(symbol) = ?", [portfolioId, symbol.trim()]);
            await db.runAsync("DELETE FROM holdings WHERE portfolioId = ? AND trim(symbol) = ?", [portfolioId, symbol.trim()]);
            console.log(`🗑️ Holding ${symbol} and its transactions deleted from portfolio ${portfolioId}`);
        } catch (error) {
            console.error("‼️ Error deleting holding:", error);
            throw error;
        }
    }

    return {
        findHolding,
        fetchHoldings,
        updateHolding,
        saveOrUpdateHolding,
        deleteHolding,
    }
}