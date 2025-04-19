import { Holding } from "@/types/portfolio";
import { dbPromise } from "@/data/db/db"
import { HoldingRequest } from "@/types/portfolio";
import { useStockRepository } from "@/data/repositories/stockRepository";

export const useHoldingRepository = () => {

    const { findStock } = useStockRepository();

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
    
    const fetchHoldings = async (portfolioId: number) => {
        const db = await dbPromise;
        const holdings = await db.getAllAsync<Holding>("SELECT * FROM holdings WHERE portfolioId = ?", [portfolioId]);
        for (const holding of holdings) {
            const stock = await findStock(holding.symbol);
            holding.currentPrice = stock?.currentPrice || 0;
            holding.gainLoss = (holding.currentPrice - holding.averagePrice) * holding.quantity;
        }
        return holdings;
    }

    return {
        fetchHoldings, 
        saveOrUpdateHolding,
    }
}