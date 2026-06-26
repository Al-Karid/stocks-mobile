import { dbPromise } from "@/data/providers/sqlite";
import { getDevicePushToken } from "@/services/pushTokenService";
import { UserProfileSettings } from "@/types/settings";

export const initSettingsDb = async () => {
    const db = await dbPromise;

    try {

        // await db.execAsync(`drop table if exists settings`);
        const tableNames = await db.getAllAsync(`select name from sqlite_master where type='table' and name not like 'sqlite_%'`);
        if (tableNames.length > 0) {
            tableNames.forEach(async (table: any) => {
                // await db.execAsync(`DROP TABLE IF EXISTS ${table.name}`);
            })
        }

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

        const freeUserProfileSettings: UserProfileSettings = {
            userProfile: "free",
            maxPorfolio: 1,
            maxWatchlist: 2,
            maxTransactions: 50,
            maxAlerts: 1,
        };

        const premiumUserProfileSettings: UserProfileSettings = {
            userProfile: "premium",
            maxPorfolio: 100,
            maxWatchlist: 100,
            maxTransactions: 100,
            maxAlerts: 100,
        };

        const initialUserProfileConstraintsCounts: UserProfileSettings = {
            userProfile: "free",
            maxPorfolio: 1,
            maxWatchlist: 2,
            maxTransactions: 50,
            maxAlerts: 1
        }

        const defaultSettings = [
            { key: "theme", value: "light" },
            { key: "language", value: "en" },
            { key: "databaseInitialized", value: "false" },
            { key: "devicePushToken", value: await getDevicePushToken() || "" },
            { key: "notificationChannels", value: JSON.stringify(notificationChannels) },
            { key: "freeUserProfileSettings", value: JSON.stringify(freeUserProfileSettings) },
            { key: "premiumUserProfileSettings", value: JSON.stringify(premiumUserProfileSettings) },
            { key: "userProfileConstraintsCounts", value: JSON.stringify(initialUserProfileConstraintsCounts) },
            { key: "autoUpdatesEnabled", value: "true" },
        ];

        for (const setting of defaultSettings) {
            await db.runAsync(
                `INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`,
                [setting.key, setting.value]
            );
        }

        console.log("✅ Default settings inserted");

    } catch (error) {
        console.log("⚠️ Error initializing settings database: ", error);
    }
}