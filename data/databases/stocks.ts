import { dbPromise } from "@/data/providers/sqlite";
import { APIStock, StockHistoryEntry } from "@/types/stock";
import { useConputeService } from "../../services/computeService";
import { Storage } from "expo-sqlite/kv-store";

const { calculatePercentageChange } = useConputeService();

export const initDb = async () => {
  const db = await dbPromise;

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
        rsi REAL,
        isInWatchlist BOOLEAN DEFAULT FALSE,
        UNIQUE(code, symbol)
      );`
    );
    console.log("✅ Database initialized: stocks");

    // Add rsi column if migrating from older schema
    try {
      await db.runAsync("ALTER TABLE stocks ADD COLUMN rsi REAL");
    } catch (_) {
      // column already exists, ignore
    }

    await db.runAsync(
      `CREATE TABLE IF NOT EXISTS stock_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        symbol TEXT NOT NULL,
        date TEXT NOT NULL,
        closing REAL NOT NULL,
        UNIQUE(symbol, date)
      );`
    );
    console.log("✅ Database initialized: stock_history");

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
          updatedAt = ?,
          rsi = ?
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
          stock.rsi ?? null,
          stock.symbol,
        ]
      );

      if (updated.changes === 0) {
        await db.runAsync(
          `INSERT INTO stocks
            (code, country, symbol, title, currentPrice, previousClosePrice, percentageChange,
             volumeTitles, volumeValues, opening, high, low, updatedAt, rsi)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
            stock.updated_at,
            stock.rsi ?? null,
          ]
        );
      }

      // Save history entries
      if (stock.history && stock.history.length > 0) {
        // Clear old history for this symbol and re-insert
        await db.runAsync("DELETE FROM stock_history WHERE symbol = ?", [stock.symbol]);

        for (const entry of stock.history) {
          await db.runAsync(
            `INSERT OR IGNORE INTO stock_history (symbol, date, closing) VALUES (?, ?, ?)`,
            [stock.symbol, entry.date, entry.closing]
          );
        }
      }
    }

    await db.execAsync("COMMIT");

    console.log(`✅ ${apiStocks.length} stocks saved to database.`);

    await Storage.setItem("lastSync", apiStocks[0].updated_at);

  } catch (error) {
    await db.execAsync("ROLLBACK");
    console.error("⚠️ Error saving stocks to db: ", error);
  }
};