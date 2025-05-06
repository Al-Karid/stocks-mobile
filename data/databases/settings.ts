import { dbPromise } from "@/data/providers/sqlite";
import { getDevicePushToken } from "@/services/pushTokenService";

export const initSettingsDb = async () => {
    const db = await dbPromise;

    try {
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS settings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                key TEXT,
                value TEXT,
                UNIQUE(key)
            );
        `);

        console.log("✅ Database initialized: settings");

        const notificationChannels = [
            { key: "push", value: true },
            { key: "sms", value: false },
        ];

        const defaultSettings = [
            { key: "theme", value: "light" },
            { key: "language", value: "en" },
            { key: "databaseInitialized", value: "false" },
            { key: "devicePushToken", value: await getDevicePushToken() },
            { key: "notificationChannels", value: JSON.stringify(notificationChannels) },
        ];

        for (const setting of defaultSettings) {
            await db.runAsync(
                `INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)`,
                [setting.key, setting.value]
            );
        }

        console.log("✅ Default settings inserted");

    } catch (error) {
        console.log("⚠️ Error initializing settings database: ", error);
    }
}