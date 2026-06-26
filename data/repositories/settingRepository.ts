import { SettingData } from "@/types/settings";
import { dbPromise } from "@/data/providers/sqlite";
import { StockSettingError } from "@/types/errors";

export const useSettingRepository = () => {

    const getSettings = async (key: string): Promise<SettingData | null> => {
        try {
            const db = await dbPromise;
            const rows = await db.getFirstAsync("SELECT * FROM settings WHERE key = ?", [key]);
            return rows as SettingData | null;
        } catch (error: any) {
            console.error("‼️ Error fetching settings:", error);
            return null;
        }
    }

    const saveSetting = async (setting: SettingData): Promise<void> => {
        try {
            const db = await dbPromise;
            await db.runAsync("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)",
                [setting.key, setting.value]
            );
            console.log(`💾 Setting ${setting.key} saved successfully`);
        } catch (error) {
            console.error("‼️ Error inserting Setting:", error);
            throw new StockSettingError("Error inserting Setting");
        }
    }

    // const deleteSetting = async (settingId: number): Promise<void> => {
    //     try {
    //         const db = await dbPromise;
    //         await db.runAsync("DELETE FROM settings WHERE id = ?", [settingId]);
    //         console.log(`💾 Setting with ID ${settingId} deleted successfully`);
    //     } catch (error) {
    //         console.error("‼️ Error deleting Setting:", error);
    //         throw new StocksAlertError("Error deleting Setting");
    //     }
    // }

    const updateSetting = async (setting: SettingData): Promise<void> => {
        try {
            const db = await dbPromise;
            await db.runAsync("UPDATE settings SET value = ? WHERE key = ?",
                [setting.value, setting.key]
            );
            console.log(`💾 Setting ${setting.key} updated successfully`);
        } catch (error) {
            console.error("‼️ Error updating Setting:", error);
        }
    }

    return {
        getSettings,
        saveSetting, 
        // deleteSetting, 
        updateSetting 
    };
}