import { dbPromise } from "@/data/providers/sqlite";

export const initAlertDatabase = async () => {
    const db = await dbPromise;

    // Drop all existing tables
    await db.execAsync("DROP TABLE IF EXISTS alerts;");

    try {
        // Alerts Table
        await db.runAsync(
            `CREATE TABLE IF NOT EXISTS alerts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                stockSymbol TEXT NOT NULL,
                stockTitle TEXT,
                type TEXT NOT NULL,
                value REAL NOT NULL,
                enabled INTEGER NOT NULL DEFAULT 1,
                UNIQUE (stockSymbol, type)
            );`
        );
        console.log("✅ Database initialized: Alerts");

        // Insert sample data
        await db.runAsync(
            `INSERT OR IGNORE INTO alerts (stockSymbol, stockTitle, type, value, enabled) 
            VALUES ('AAPL', 'Apple Inc.', 'above', 150, 1);`
        );

        await db.runAsync(
            `INSERT OR IGNORE INTO alerts (stockSymbol, stockTitle, type, value, enabled) 
            VALUES ('GOOGL', 'Alphabet Inc.', 'below', 2800, 1);`
        );
    } catch (error) {
        console.error("❌ Error initializing database:", error);
    }
}