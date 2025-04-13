import { useState, useEffect } from "react";
import { dbPromise } from "./db/db";
import { Stock } from "@/types/stock";

export const useStockDataService = () => {

  const fetchStocks = async (): Promise<Stock[]> => {
    const db = await dbPromise;
    const stocks = await db.getAllAsync<Stock>("SELECT * FROM stocks");
    return stocks;
  };

  const findStock = async (symbol: string): Promise<Stock | null> => {
    if (!symbol) return null;
    const db = await dbPromise;
    const stock = await db.getFirstAsync<Stock>(
      "SELECT * FROM stocks WHERE trim(symbol) = ?",
      [symbol.trim()]
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

    return combined.sort((a, b) => b.percentageChange - a.percentageChange);
  };

  return {
    findStock,
    fetchStocks,
    fetchPalmares,
  };
};
