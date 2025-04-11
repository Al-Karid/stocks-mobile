import { Portfolio } from "@/types/portfolio";
import { dbPromise } from "./db/db";

export const createPortfolio = async (name: string): Promise<void> => {
  const db = await dbPromise;
  try {
    await db.runAsync(`INSERT INTO portfolios (name) VALUES (?)`, [name]);
  } catch (error) {
    console.error("‼️ Error creating portfolio:", error);
    throw error;
  } finally{
    console.log("💾 Portfolio created successfully: " + name);
  }
};

export const getPortfolios = async () : Promise<Portfolio[]> => {
  const db = await dbPromise;
  try {
    const portfolios = await db.getAllAsync<Portfolio>(`SELECT * FROM portfolios`);
    return portfolios;
  } catch (error) {
    console.error("‼️ Error fetching portfolios:", error);
    throw error;
  } finally{
    console.log("💾 Portfolios fetched successfully");
  }
}

export const getPortfolioById = async (id: number): Promise<Portfolio | null> => {
  const db = await dbPromise;
  try {
    const portfolio = await db.getFirstAsync<Portfolio>(`SELECT * FROM portfolios WHERE id = ?`, [id]);
    return portfolio;
  } catch (error) {
    console.error("‼️ Error fetching portfolio by ID:", error);
    throw error;
  } finally{
    console.log("💾 Portfolio fetched successfully by ID: " + id);
  }
}

export const updatePortfolio = async (id: number, name: string): Promise<void> => {
  const db = await dbPromise;
  try {
    await db.runAsync(`UPDATE portfolios SET name = ? WHERE id = ?`, [name, id]);
  } catch (error) {
    console.error("‼️ Error updating portfolio:", error);
    throw error;
  } finally{
    console.log("💾 Portfolio updated successfully: " + name);
  }
}

export const deletePortfolio = async (id: number): Promise<void> => {
  const db = await dbPromise;
  try {
    await db.runAsync(`DELETE FROM portfolios WHERE id = ?`, [id]);
  } catch (error) {
    console.error("‼️ Error deleting portfolio:", error);
    throw error;
  } finally{
    console.log("💾 Portfolio deleted successfully: " + id);
  }
}
