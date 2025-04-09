import { dbPromise } from "./db.js";

export const addToWatchlist = async (symbol) => {
  try {
    const db = await dbPromise;
    await db.runAsync("INSERT OR IGNORE INTO watchlists (symbol) VALUES (?)", [
      symbol,
    ]);
    const up = await db.runAsync(
      "UPDATE stocks SET isInWatchlist = TRUE WHERE trim(symbol) = ?",
      [symbol.trim()]
    );

    console.log("Added to watchlist: ", symbol);
    console.log("Updated stocks table: ", up);
  } catch (error) {
    console.error("Error adding to watchlist:", error);
  }
};

export const removeFromWatchlist = async (symbol) => {
  const db = await dbPromise;
  await db.runAsync("DELETE FROM watchlists WHERE trim(symbol) = ?", [symbol.trim()]);
  await db.runAsync(
    "UPDATE stocks SET isInWatchlist = FALSE WHERE trim(symbol) = ?",
    [symbol.trim()]
  );
  console.log("Stock removed from watchlist: ", symbol);
};

export const getWatchlist = async () => {
  try {
    const db = await dbPromise;

    // Fetch all watchlist symbols
    const watchlist = await db.getAllAsync("SELECT symbol FROM watchlists");
    // console.log("Watchlist symbols: ", watchlist);

    // Fetch all stock data
    const stocks = await db.getAllAsync("SELECT * FROM stocks");
    // console.log("All stocks: ", stocks);

    // Filter stocks that are in the watchlist
    const stocksInWatchlist = stocks.filter((stock) =>
      watchlist.some((watchedStock) => watchedStock.symbol.trim() === stock.symbol.trim())
    );

    console.log("Stocks in Watchlist: ", stocksInWatchlist[0]);

    return stocksInWatchlist;
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    throw error;
  }
};

export const getStocks = async () => {
  const db = await dbPromise;
  const stocks = await db.getAllAsync("SELECT * FROM stocks");
  return stocks;
};

export const getStock = async (symbol) => {
  const db = await dbPromise;
  const stock = await db.getFirstAsync("SELECT * FROM stocks WHERE trim(symbol) = ?", [
    symbol,
  ]);
  return stock;
};
