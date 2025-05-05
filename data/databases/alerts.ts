import { dbPromise } from "@/data/providers/sqlite";

export const initAlertDatabase = async () => {
    const db = await dbPromise;

    // Drop all existing tables
    // await db.execAsync("DROP TABLE IF EXISTS alerts;");
    // await db.execAsync("DROP TABLE IF EXISTS notifications;");

    try {
        // Alerts Table
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

        // // Insert sample data
        // await db.runAsync(
        //     `INSERT OR IGNORE INTO alerts (uiid, devicePushToken, stockSymbol, stockTitle, type, value, enabled) 
        //     VALUES ('123e4567-e89b-12d3-a456-426614174000', 'ExponentPushToken[9EGyIJNo0EAo1maf1mR9qR]', 'AAPL', 'Apple Inc.', 'above', 150, 1);`
        // );

        console.log("✅ Sample data inserted into alerts table");
        
    } catch (error) {
        console.error("❌ Error initializing database:", error);
    }
}