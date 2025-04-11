import { dbPromise } from "./db";

export const initPortfolioDb = async () => {
  
  const db = await dbPromise;

  try {

    // Fix remove the drop statements
    await db.runAsync("drop table if exists portfolios");
    await db.runAsync("drop table if exists transactions");
    await db.runAsync("drop table if exists holdings");

    // Portfolios Table
    db.runAsync(
      `CREATE TABLE IF NOT EXISTS portfolios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
        UNIQUE (name)
      );`
    );
    // Transactions Table
    db.runAsync(
      `CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        portfolioId INTEGER NOT NULL,
        symbol TEXT NOT NULL,
        type TEXT NOT NULL,
        transactionDate TEXT NOT NULL,
        quantity REAL NOT NULL,
        pricePerShare REAL NOT NULL,
        totalAmount REAL NOT NULL,
        fees REAL NOT NULL,
        notes TEXT,
        FOREIGN KEY (portfolioId) REFERENCES portfolios(id)
      );`
    );
    // Holdings Table
    db.runAsync(
      `CREATE TABLE IF NOT EXISTS holdings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        portfolioId INTEGER NOT NULL,
        symbol TEXT NOT NULL,
        name TEXT,
        quantity REAL NOT NULL,
        averagePrice REAL NOT NULL,
        currentPrice REAL NOT NULL,
        totalCost REAL,
        gainLoss REAL NOT NULL,
        FOREIGN KEY (portfolioId) REFERENCES portfolios(id),
        UNIQUE (portfolioId, symbol)
      );`
    );
  } catch (error) {
    console.error("⚠️ Error initializing portfolio database: ", error);
    throw error;
  } finally {
    console.log("✅ Portfolio database initialized");
  }
};
// export default initPortfolioDb;
