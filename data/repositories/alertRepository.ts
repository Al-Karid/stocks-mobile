import { dbPromise } from "@/data/providers/sqlite";
import { AlertData } from "@/types/alerts";
import { StocksAlertError } from "@/types/errors";

export const useAlertRepository = () => {

    const getAlerts = async (): Promise<AlertData[]> => {
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
            await db.runAsync(`
                INSERT INTO alerts 
                (
                    uuid, 
                    devicePushToken, 
                    stockSymbol, 
                    stockTitle, 
                    alertType, 
                    value, 
                    enabled,
                    synced,
                    notificationChannels
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    alert.uuid ?? "",
                    alert.devicePushToken ?? "",
                    alert.stockSymbol ?? "",
                    alert.stockTitle ?? "",
                    alert.alertType ?? "",
                    alert.value ?? 0,
                    alert.enabled ?? false,
                    alert.synced ?? false,
                    JSON.stringify(alert.notificationChannels) ?? "{}"
                ]
            );
            console.log(`💾 Alert ${alert.stockTitle} saved successfully`);
        } catch (error) {
            console.error("‼️ Error saving Alert:", error);
            throw new StocksAlertError("Error saving Alert");
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
            await db.runAsync("UPDATE alerts SET alertType = ?, value = ?, enabled = ?, synced = ? WHERE id = ?",
                [alert.alertType, alert.value, alert.enabled, alert.synced, alert.id]
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

    const findAllNonSyncedAlerts = async (): Promise<AlertData[]> => {
        try {
            const db = await dbPromise;
            const alerts = await db.getAllAsync<AlertData>("SELECT * FROM alerts WHERE synced = 0");
            if (alerts) {
                return alerts;
            } else {
                console.info(`✅ All alerts are synced`);
                return [];
            }
        } catch (error) {
            console.error("‼️ Error fetching Alerts by synced status:", error);
            throw new StocksAlertError("Error fetching Alerts by synced status");
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