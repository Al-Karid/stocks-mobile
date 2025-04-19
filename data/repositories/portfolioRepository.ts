import { Portfolio } from "@/types/portfolio";
import { dbPromise } from "@/data/db/db";
import { useHoldingRepository } from "./holdingRepository";

const { computePortfolioPerformance } = useHoldingRepository();

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
      }
      console.log("💾 Portfolios fetched successfully");
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
    name: string
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
      await db.runAsync(`DELETE FROM portfolios WHERE id = ?`, [id]);
      console.log("💾 Portfolio deleted successfully: " + id);
    } catch (error) {
      console.error("‼️ Error deleting portfolio:", error);
      throw error;
    }
  }

  return {
    createPortfolio,
    getPortfolios,
    getPortfolioById,
    updatePortfolio,
    deletePortfolio,
  };
};
