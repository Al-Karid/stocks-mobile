import { Portfolio } from "@/types/portfolio";
import { dbPromise } from "@/data/db/db";

export const createPortfolio = async (name: string): Promise<void> => {
  const db = await dbPromise;
  try {
    await db.runAsync(`INSERT INTO portfolios (name) VALUES (?)`, [name]);
    console.log("💾 Portfolio created successfully: " + name);
  } catch (error) {
    console.error("‼️ Error creating portfolio:", error);
    throw error;
  }
};

export const getPortfolios = async (): Promise<Portfolio[]> => {
  const db = await dbPromise;
  try {
    const portfolios = await db.getAllAsync<Portfolio>(
      `SELECT * FROM portfolios`
    );
    console.log("💾 Portfolios fetched successfully");
    return portfolios;
  } catch (error) {
    console.error("‼️ Error fetching portfolios:", error);
    throw error;
  }
};

export const getPortfolioById = async (
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
};

export const updatePortfolio = async (
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
};

export const deletePortfolio = async (id: number): Promise<void> => {
  const db = await dbPromise;
  try {
    await db.runAsync(`DELETE FROM portfolios WHERE id = ?`, [id]);
    console.log("💾 Portfolio deleted successfully: " + id);
  } catch (error) {
    console.error("‼️ Error deleting portfolio:", error);
    throw error;
  }
};
