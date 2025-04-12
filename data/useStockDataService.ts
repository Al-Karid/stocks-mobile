import { useState, useEffect } from "react";
import { dbPromise } from "./db/db";
import { Stock } from "@/types/stock";

export const useStockDataService = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [palmares, setPalmares] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStocks = async (): Promise<Stock[]> => {
    setLoading(true);
    const db = await dbPromise;
    const stocks = await db.getAllAsync<Stock>("SELECT * FROM stocks");
    setStocks(stocks);
    setLoading(false);
    return stocks;
  };

  const findStock = async (symbol: string): Promise<Stock | null> => {
    setLoading(true);
    if (!symbol) return null;
    const db = await dbPromise;
    const stock = await db.getFirstAsync<Stock>(
      "SELECT * FROM stocks WHERE trim(symbol) = ?",
      [symbol]
    );
    return stock;
  };

  const fetchPalmares = async (): Promise<Stock[]> => {
    const db = await dbPromise;
    const gainers = await db.getAllAsync<Stock>(
      "SELECT * FROM stocks ORDER BY percentageChange DESC LIMIT 5"
    );
    const losers = await db.getAllAsync<Stock>(
      "SELECT * FROM stocks ORDER BY percentageChange ASC LIMIT 5"
    );
    const combined = [
      ...gainers.map((stock) => ({ ...stock, type: "gainer" })),
      ...losers.map((stock) => ({ ...stock, type: "loser" })),
    ];
    setPalmares(
      combined.sort((a, b) => b.percentageChange - a.percentageChange)
    );
    return combined;
  };

  useEffect(() => {
    fetchStocks();
    fetchPalmares();
  }, []);

  return {
    stocks,
    loading,
    palmares,
    findStock,
    fetchStocks,
    fetchPalmares,
  };
};
