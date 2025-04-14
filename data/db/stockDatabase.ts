import { dbPromise } from "@/data/db/db";
import { Stock } from "@/types/stock";

export const initDb = async () => {
  const db = await dbPromise;

  try {

    // Fix remove the drop statements
    await db.runAsync("drop table if exists stocks");
    await db.runAsync("drop table if exists watchlists");

    await db.runAsync(
      `CREATE TABLE IF NOT EXISTS watchlists (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            symbol TEXT UNIQUE NOT NULL
          );`
    );

    console.log("✅ Database initialized: watchlists");

    await db.runAsync(
      `CREATE TABLE IF NOT EXISTS stocks (
          id INTEGER PRIMARY KEY NOT NULL,
          code TEXT NOT NULL,
          country TEXT,
          symbol TEXT UNIQUE NOT NULL,
          title TEXT,
          currentPrice REAL,
          previousClosePrice REAL,
          percentageChange REAL,
          volumeTitles INTEGER,
          volumeValues REAL,
          opening REAL,
          high REAL,
          low REAL,
          updatedAt TEXT,
          isInWatchlist BOOLEAN DEFAULT FALSE
        );`
    );

    console.log("✅ Database initialized: stocks");
  } catch (error) {
    console.error("⚠️ Error initializing database: ", error);
    throw error;
  }
};

export const saveStocktoDb = async (stock: Stock) => {
  try {
    const db = await dbPromise;
    await db.runAsync(
      "INSERT OR REPLACE INTO stocks \
      (\
      id, \
      code, \
      country, \
      symbol, \
      title, \
      currentPrice, \
      previousClosePrice, \
      percentageChange, \
      volumeTitles, \
      volumeValues, \
      opening, \
      high, \
      low, \
      updatedAt, \
      isInWatchlist\
      ) \
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)",
      [
        stock.id,
        stock.code,
        stock.country,
        stock.symbol,
        stock.title,
        stock.currentPrice,
        stock.previousClosePrice,
        stock.percentageChange,
        stock.volumeTitles,
        stock.volumeValues,
        stock.opening,
        stock.high,
        stock.low,
        stock.updatedAt,
      ]
    );
    // console.log("Stock saved to db: ", stock.symbol);
  } catch (error) {
    console.error("⚠️ Error saving stock to db: ", error);
  }
};