import { dbPromise } from "@/data/db/db";
import { APIStock } from "@/types/stock";
import { useConputeService } from "../computeService";

const { calculatePercentageChange } = useConputeService();

export const initDb = async () => {
  const db = await dbPromise;

  // Drop all existing tables
  try {
    await db.execAsync("DROP TABLE IF EXISTS stocks;");
    await db.execAsync("DROP TABLE IF EXISTS watchlists;");
    await db.execAsync("DROP TABLE IF EXISTS portfolios;");
    await db.execAsync("DROP TABLE IF EXISTS transactions;");
    console.log("✅ Dropped existing stocks table");
  } catch (error) {
    console.error("⚠️ Error dropping stocks table: ", error);
  }

  try {
    await db.runAsync(
      `CREATE TABLE IF NOT EXISTS watchlists (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        symbol TEXT UNIQUE NOT NULL
      );`
    );
    console.log("✅ Database initialized: watchlists");

    await db.runAsync(
      `CREATE TABLE IF NOT EXISTS stocks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT NOT NULL,
        country TEXT,
        symbol TEXT NOT NULL,
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
        isInWatchlist BOOLEAN DEFAULT FALSE,
        UNIQUE(code, symbol)
      );`
    );
    console.log("✅ Database initialized: stocks");

  } catch (error) {
    console.error("⚠️ Error initializing database: ", error);
    throw error;
  }
};

export const saveStocksToDb = async (apiStocks: APIStock[]) => {
  const db = await dbPromise;

  try {
    await db.execAsync("BEGIN TRANSACTION");

    for (const stock of apiStocks) {
      const updated = await db.runAsync(
        `UPDATE stocks SET
          currentPrice = ?, 
          previousClosePrice = ?, 
          percentageChange = ?, 
          volumeTitles = ?, 
          volumeValues = ?, 
          opening = ?, 
          high = ?, 
          low = ?, 
          updatedAt = ?
         WHERE symbol = ?`,
        [
          stock.current_price,
          stock.previous_close_price,
          calculatePercentageChange(stock.current_price, stock.previous_close_price),
          stock.volume_titles,
          stock.volume_values,
          stock.opening,
          stock.high,
          stock.low,
          stock.updated_at,
          stock.symbol
        ]
      );

      if (updated.changes === 0) { // No row updated? Insert new
        await db.runAsync(
          `INSERT INTO stocks
            (code, 
            country, 
            symbol, 
            title, 
            currentPrice, 
            previousClosePrice, 
            percentageChange, 
            volumeTitles, 
            volumeValues, 
            opening, 
            high, 
            low, 
            updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            stock.code,
            stock.country,
            stock.symbol,
            stock.title,
            stock.current_price,
            stock.previous_close_price,
            calculatePercentageChange(stock.current_price, stock.previous_close_price),
            stock.volume_titles,
            stock.volume_values,
            stock.opening,
            stock.high,
            stock.low,
            stock.updated_at
          ]
        );
      }
    }

    await db.execAsync("COMMIT");

    console.log(`✅ ${apiStocks.length} stocks saved to database.`);

  } catch (error) {
    await db.execAsync("ROLLBACK");
    console.error("⚠️ Error saving stocks to db: ", error);
  }
};