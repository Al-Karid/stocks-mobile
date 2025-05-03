import { Portfolio } from "@/types/portfolio";
import { dbPromise } from "@/data/providers/sqlite";
import { usePortfolioService } from "@/services/portfolioService";
import { useHoldingRepository } from "@/data/repositories/holdingRepository";
import { StocksPortfolioError } from "@/types/errors";

const { computePortfolioPerformance } = usePortfolioService();
const { fetchHoldings } = useHoldingRepository();

export const usePortfolioRepository = () => {

  const createPortfolio = async (name: string): Promise<void> => {
    const db = await dbPromise;
    try {
      await db.runAsync(`INSERT INTO portfolios (name) VALUES (?)`, [name]);
      console.log("💾 Portfolio created successfully: " + name);
    } catch (error) {
      console.error("‼️ Error creating portfolio:", error);
      throw error;
    }
  }

  const getPortfolios = async (): Promise<Portfolio[]> => {
    const db = await dbPromise;
    try {
      const portfolios = await db.getAllAsync<Portfolio>(
        `SELECT * FROM portfolios`
      );
      // Fetch performance for each portfolio
      for (const portfolio of portfolios) {
        const performance = await computePortfolioPerformance(portfolio.id);
        if (performance) {
          portfolio.performance = performance;
        } else {
          portfolio.performance = {
            totalCost: 0,
            totalValue: 0,
            totalGainLoss: 0,
            gainLossPercentage: 0,
          };
        }
        // Fetch holdings for each portfolio
        const holdings = await fetchHoldings(portfolio.id);
        portfolio.holdings = holdings;
      }
      return portfolios;
    } catch (error) {
      console.error("‼️ Error fetching portfolios:", error);
      throw error;
    }
  }

  const getPortfolioById = async (
    id: number
  ): Promise<Portfolio | null> => {
    const db = await dbPromise;
    try {
      const portfolio = await db.getFirstAsync<Portfolio>(
        `SELECT * FROM portfolios WHERE id = ?`,
        [id]
      );
      console.log("💾 Portfolio fetched successfully by ID: " + id);
      return portfolio;
    } catch (error) {
      console.error("‼️ Error fetching portfolio by ID:", error);
      throw error;
    }
  }

  const updatePortfolio = async (
    id: number,
    name: string,
  ): Promise<void> => {
    const db = await dbPromise;
    try {
      await db.runAsync(`UPDATE portfolios SET name = ? WHERE id = ?`, [
        name,
        id,
      ]);
      console.log("💾 Portfolio updated successfully: " + name);
    } catch (error) {
      console.error("‼️ Error updating portfolio:", error);
      throw error;
    }
  }

  const deletePortfolio = async (id: number): Promise<void> => {
    const db = await dbPromise;
    try {

      // Check if the portfolio is the default one
      const defaultPortfolio = await db.getFirstAsync<Portfolio>(
        `SELECT * FROM portfolios WHERE isDefault = 1`
      );

      if (defaultPortfolio && defaultPortfolio.id === id) {
        //console.error("‼️ Cannot delete the default portfolio");
        throw new StocksPortfolioError("Default portfolio cannot be deleted");
      }

      // First, delete all holdings associated with the portfolio
      await db.runAsync(`DELETE FROM holdings WHERE portfolioId = ?`, [id]);
      // Then, delete all transactions associated with the portfolio
      await db.runAsync(`DELETE FROM transactions WHERE portfolioId = ?`, [id]);
      // Finally, delete the portfolio itself
      await db.runAsync(`DELETE FROM portfolios WHERE id = ?`, [id]);
      console.log("💾 Portfolio deleted successfully: " + id);
    } catch (error) { throw error; }
  }

  const makePortfolioDefault = async (id: number): Promise<void> => {
    const db = await dbPromise;
    try {
      await db.runAsync(
        `UPDATE portfolios SET isDefault = 0 WHERE isDefault = 1`
      );
      await db.runAsync(
        `UPDATE portfolios SET isDefault = 1 WHERE id = ?`,
        [id]
      );
      console.log("💾 Portfolio set as default successfully: " + id);
    } catch (error) {
      console.error("‼️ Error setting portfolio as default:", error);
      throw new StocksPortfolioError(
        "Error setting portfolio as default: " + error
      );
    }
  }

  return {
    createPortfolio,
    getPortfolios,
    getPortfolioById,
    updatePortfolio,
    deletePortfolio,
    makePortfolioDefault,
  };
};
