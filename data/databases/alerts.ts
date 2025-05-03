import { dbPromise } from "@/data/providers/sqlite";

export const initAlertDatabase = async () => {
    const db = await dbPromise;

    // Drop all existing tables
    await db.execAsync("DROP TABLE IF EXISTS alerts;");
    await db.execAsync("DROP TABLE IF EXISTS notifications;");

    try {
        // Alerts Table
        await db.runAsync(
            `CREATE TABLE IF NOT EXISTS alerts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                stockSymbol TEXT NOT NULL,
                stockTitle TEXT,
                type TEXT NOT NULL,
                value INTEGER NOT NULL,
                enabled INTEGER NOT NULL DEFAULT 1,
                UNIQUE (stockSymbol, type)
            );`
        );
        console.log("✅ Database initialized: Alerts");

        // Notifications Table
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
        console.log("✅ Database initialized: Notifications");

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