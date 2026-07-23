import { dbPromise } from "@/data/providers/sqlite";

export interface Migration {
  version: number;
  name: string;
  up: (db: any) => Promise<void>;
}

export const MIGRATIONS: Migration[] = [
  {
    version: 1,
    name: "initial schema — all base tables",
    up: async (db) => {
      // watchlists
      await db.runAsync(
        `CREATE TABLE IF NOT EXISTS watchlists (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          symbol TEXT UNIQUE NOT NULL
        );`
      );
      // stocks (without rsi – added in v2)
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
      // portfolios
      await db.runAsync(
        `CREATE TABLE IF NOT EXISTS portfolios (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          isDefault INTEGER NOT NULL DEFAULT 0,
          UNIQUE (name)
        );`
      );
      await db.runAsync(
        `INSERT OR IGNORE INTO portfolios (name, isDefault) VALUES ('Default Portfolio', 1);`
      );
      // transactions
      await db.runAsync(
        `CREATE TABLE IF NOT EXISTS transactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          portfolioId INTEGER NOT NULL,
          symbol TEXT NOT NULL,
          name TEXT NOT NULL,
          type TEXT NOT NULL,
          transactionDate TEXT NOT NULL,
          quantity REAL NOT NULL,
          pricePerShare REAL NOT NULL,
          realPricePerShare REAL NOT NULL,
          totalCost REAL NOT NULL,
          fees REAL NOT NULL,
          notes TEXT,
          FOREIGN KEY (portfolioId) REFERENCES portfolios(id)
        );`
      );
      // holdings
      await db.runAsync(
        `CREATE TABLE IF NOT EXISTS holdings (
          portfolioId INTEGER NOT NULL,
          symbol TEXT NOT NULL,
          name TEXT NOT NULL,
          quantity REAL NOT NULL,
          averagePrice REAL NOT NULL,
          totalCost REAL NOT NULL,
          currentPrice REAL NOT NULL,
          gainLoss REAL NOT NULL,
          targetPrice REAL,
          targetDate TEXT,
          UNIQUE(portfolioId, symbol),
          FOREIGN KEY (portfolioId) REFERENCES portfolios(id)
        );`
      );
      // alerts
      await db.runAsync(
        `CREATE TABLE IF NOT EXISTS alerts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          uuid TEXT,
          devicePushToken TEXT,
          stockSymbol TEXT NOT NULL,
          stockTitle TEXT,
          alertType TEXT NOT NULL CHECK(alertType IN ('above', 'below')),
          value INTEGER NOT NULL,
          enabled INTEGER NOT NULL DEFAULT 1,
          synced INTEGER NOT NULL DEFAULT 0,
          notificationChannels TEXT,
          UNIQUE (uuid, stockSymbol, alertType)
        );`
      );
      // notifications
      await db.runAsync(
        `CREATE TABLE IF NOT EXISTS notifications (
          id TEXT PRIMARY KEY NOT NULL,
          title TEXT NOT NULL,
          body TEXT NOT NULL,
          notification_type TEXT NOT NULL,
          stock_symbol TEXT NOT NULL,
          timestamp TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
          UNIQUE (id)
        );`
      );
      console.log("✅ Migration v1 applied: initial schema");
    },
  },
  {
    version: 2,
    name: "add rsi column to stocks",
    up: async (db) => {
      try {
        await db.runAsync("ALTER TABLE stocks ADD COLUMN rsi REAL");
        console.log("✅ Migration v2 applied: rsi column");
      } catch (_) {
        // column already exists (idempotent)
        console.log("ℹ️ Migration v2 skipped: rsi column already exists");
      }
    },
  },
  {
    version: 3,
    name: "add stock_history table",
    up: async (db) => {
      await db.runAsync(
        `CREATE TABLE IF NOT EXISTS stock_history (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          symbol TEXT NOT NULL,
          date TEXT NOT NULL,
          closing REAL NOT NULL,
          UNIQUE(symbol, date)
        );`
      );
      console.log("✅ Migration v3 applied: stock_history table");
    },
  },
];