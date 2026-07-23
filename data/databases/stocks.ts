import { dbPromise } from "@/data/providers/sqlite";
import { APIStock, StockHistoryEntry } from "@/types/stock";
import { useConputeService } from "../../services/computeService";
import { Storage } from "expo-sqlite/kv-store";

const { calculatePercentageChange } = useConputeService();

// initDb is kept for backward compatibility (called from settings reset),
// but schema creation is now handled by the migration system.
export const initDb = async () => {
  // Migrations handle all table creation. This is a no-op.
  console.log("✅ initDb called — migrations handle schema creation");
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