import { dbPromise } from "@/data/providers/sqlite";
import { AlertData } from "@/types/alerts";
import { StocksAlertError } from "@/types/errors";

export const useAlertRepository = () => {
    
    const getAlerts = async () : Promise<AlertData[]> => {
        try {
            const db = await dbPromise;
            const alerts = await db.getAllAsync<AlertData>("SELECT * FROM alerts");
            return alerts;
        } catch (error) {
            console.error("‼️ Error fetching alerts:", error);
        }
        return [] as AlertData[];
    }

    const saveAlert = async (alert: AlertData): Promise<void> => {
        try {
            const db = await dbPromise;
            await db.runAsync("INSERT OR REPLACE INTO alerts (stockSymbol, stockTitle, type, value, enabled) VALUES (?, ?, ?, ?, ?)",
                [alert.stockSymbol, alert.stockTitle!, alert.type, alert.value, alert.enabled]
            );
            console.log(`💾 Alert ${alert.stockTitle} saved successfully`);
        } catch (error) {
            console.error("‼️ Error inserting Alert:", error);
            throw new StocksAlertError("Error inserting Alert");
        }
    }

    const deleteAlert = async (alertId: number): Promise<void> => {
        try {
            const db = await dbPromise;
            await db.runAsync("DELETE FROM alerts WHERE id = ?", [alertId]);
            console.log(`💾 Alert with ID ${alertId} deleted successfully`);
        } catch (error) {
            console.error("‼️ Error deleting Alert:", error);
            throw new StocksAlertError("Error deleting Alert");
        }
    }

    const updateAlert = async (alert: AlertData): Promise<void> => {
        try {
            const db = await dbPromise;
            await db.runAsync("UPDATE alerts SET type = ?, value = ?, enabled = ? WHERE id = ?",
                [alert.type, alert.value, alert.enabled, alert.id]
            );
            console.log(`💾 Alert ${alert.stockTitle} updated successfully`);
        } catch (error) {
            console.error("‼️ Error updating Alert:", error);
            throw new StocksAlertError("Error updating Alert");
        }
    }

    const findAlertById = async (alertId: number): Promise<AlertData | null> => {
        try {
            const db = await dbPromise;
            const alert = await db.getFirstAsync<AlertData>("SELECT * FROM alerts WHERE id = ?", [alertId]);
            if (alert) {
                return alert;
            } else {
                console.error(`‼️ Alert with ID ${alertId} not found`);
                return null;
            }
        } catch (error) {
            console.error("‼️ Error fetching Alert by ID:", error);
            throw new StocksAlertError("Error fetching Alert by ID");
        }
    }

    return {
        getAlerts,
        saveAlert,
        deleteAlert,
        updateAlert,
        findAlertById,
    }
}