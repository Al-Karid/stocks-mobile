//File: portfoliodb.js
import { dbPromise } from "@/data/db/db";

export const initPortfolioDb = async () => {
  
  const db = await dbPromise;

  try {

    // Fix remove the drop statements
    await db.runAsync("drop table if exists portfolios");
    await db.runAsync("drop table if exists transactions");
    await db.runAsync("drop table if exists holdings");

    // Portfolios Table
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
    console.log("✅ Database initialized: Portfolios");
    
    // Transactions Table
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
    console.log("✅ Database initialized: Transactions");
    
    // Holdings Table
    await db.runAsync(
      `CREATE TABLE IF NOT EXISTS holdings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        portfolioId INTEGER NOT NULL,
        symbol TEXT NOT NULL,
        name TEXT NOT NULL,
        quantity REAL NOT NULL,
        averagePrice REAL NOT NULL,
        totalCost REAL NOT NULL,  
        FOREIGN KEY (portfolioId) REFERENCES portfolios(id),
        UNIQUE (portfolioId, symbol)
      );`
    );
    console.log("✅ Database initialized: Holdings");

  } catch (error) {
    console.error("⚠️ Error initializing portfolio database: ", error);
    throw error;
  }
};
