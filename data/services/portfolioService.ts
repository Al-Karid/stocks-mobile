import { useHoldingRepository } from "@/data/repositories/holdingRepository";

export const usePortfolioService = () => {

    const { fetchHoldings } = useHoldingRepository();

    const computePortfolioPerformance = async (portfolioId: number) => {
        try {
            const holdings = await fetchHoldings(portfolioId);
            const totalValue = holdings.reduce((sum, holding) => sum + (holding.currentPrice! * holding.quantity), 0);
            const totalCost = holdings.reduce((sum, holding) => sum + holding.totalCost, 0);
            const performance = totalValue - totalCost;
            const gainLossPercentage = ((performance / totalCost) * 100);
            return {
                totalValue,
                totalCost,
                totalGainLoss: performance,
                gainLossPercentage
            };
        } catch (error) {
            console.error("‼️ Error computing portfolio performance:", error);
            return null;
        }
    }

    return {
        computePortfolioPerformance
    }
}