import { Notification } from "@/types/alerts";
import { dbPromise } from "@/data/providers/sqlite";

export const useNotificationRepository = () => {

    /**
     * Fetch all notifications from the database.
     * @returns An array of notifications.
     */
    const getNotifications = async (): Promise<Notification[]> => {
        try {
            const db = await dbPromise;
            const notifications = await db.getAllAsync<Notification>(
                `SELECT * FROM notifications ORDER BY timestamp DESC`
            );
            return notifications;
        } catch (error) {
            console.error("❌ Error fetching notifications:", error);
            return [];
        }
    };

    /**
     * Save a notification to the database.
     * @param notification - The notification data to save.
     */
    const saveNotification = async (notification: Notification) => {
        try {
            const db = await dbPromise;
            await db.runAsync(
                `INSERT OR IGNORE INTO notifications (id, title, body, notification_type, stock_symbol, timestamp) 
                VALUES (?, ?, ?, ?, ?, ?)`,
                [notification.id, notification.title, notification.body, notification.notification_type, notification.stock_symbol, notification.timestamp]
            );
            console.log("✅ Notification saved successfully:", notification);
        } catch (error) {
            console.error("❌ Error saving notification:", error);
        }
    };

    return {
        getNotifications,
        saveNotification,
    };
}