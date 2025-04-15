import { dbPromise } from "@/data/db/db";
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

  const addToWatchlist = async (symbol: string) => {
    try {
      const db = await dbPromise;
      await db.runAsync("INSERT OR IGNORE INTO watchlists (symbol) VALUES (?)", [
        symbol,
      ]);
      const up = await db.runAsync(
        "UPDATE stocks SET isInWatchlist = TRUE WHERE trim(symbol) = ?",
        [symbol.trim()]
      );
  
      console.log("✅ Added to watchlist: ", symbol.trim());
      // console.log("Updated stocks table: ", up);
    } catch (error) {
      console.error("⚠️ Error adding to watchlist:", error);
    }
  };

  const getWatchlist = async (): Promise<Watchlist[]> => {
    const db = await dbPromise;
    const watchlist = await db.getAllAsync<Watchlist>("SELECT symbol FROM watchlists");
    return watchlist;
  };
  
  const updateWatchlist = async (): Promise<void> => {
    const watchlist = await getWatchlist();
    watchlist.forEach((stock) => {
      addToWatchlist(stock.symbol!);
    })
  };
  
  const removeFromWatchlist = async (symbol: string) => {
    const db = await dbPromise;
    await db.runAsync("DELETE FROM watchlists WHERE trim(symbol) = ?", [
      symbol.trim(),
    ]);
    await db.runAsync(
      "UPDATE stocks SET isInWatchlist = FALSE WHERE trim(symbol) = ?",
      [symbol.trim()]
    );
    console.log("‼️ Stock removed from watchlist: ", symbol.trim());
  };
  
  const getWatchlistAsStocks = async (): Promise<Stock[]> => {
    try {
      const db = await dbPromise;
  
      // Fetch all watchlist symbols
      const watchlist = await db.getAllAsync<Watchlist>("SELECT symbol FROM watchlists");
      // console.log("Watchlist symbols: ", watchlist);
  
      // Fetch all stock data
      const stocks = await db.getAllAsync<Stock>("SELECT * FROM stocks");
      // console.log("All stocks: ", stocks);
  
      // Filter stocks that are in the watchlist
      const stocksInWatchlist = stocks.filter((stock) =>
        watchlist.some(
          (watchedStock) => watchedStock.symbol?.trim() === stock.symbol.trim()
        )
      );
  
      // console.log("Stocks in Watchlist: ", stocksInWatchlist[0]);
  
      return stocksInWatchlist;
    } catch (error) {
      console.error("⚠️ Error fetching watchlist:", error);
      throw error;
    }
  };

  return {
    findStock,
    fetchStocks,
    fetchPalmares,
    addToWatchlist,
    removeFromWatchlist,
    getWatchlist,
    getWatchlistAsStocks,
    updateWatchlist,
  };
};
