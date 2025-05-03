import { useNotificationRepository } from "@/data/repositories/notificationRepository";
import { Notification } from "@/types/alerts";
import { create } from "zustand";

interface NotificationStore {
    notifications: Notification[] | null;
    todayNotificationsCount: number;
    fetchNotifications: () => Promise<Notification[]>;
    addNotification: (notification: Notification) => void;
    countTodayNotifications: () => number;
}

const { getNotifications, saveNotification } = useNotificationRepository();

export const useNotificationStore = create<NotificationStore>((set, get) => ({
    notifications: null,
    todayNotificationsCount: 0,
    fetchNotifications: async () => {
        const fetchedNotifications = await getNotifications();
        set({ notifications: fetchedNotifications });
        set({ todayNotificationsCount: get().countTodayNotifications() });
        return fetchedNotifications;
    },
    addNotification: async (notification: Notification) => {
        console.log("Adding notification:", notification);
        
        await saveNotification(notification).then(async () => {
            const fetchedNotifications = await getNotifications();
            set({ notifications: fetchedNotifications });
            set({ todayNotificationsCount: get().countTodayNotifications() });
        });
    },
    countTodayNotifications: () => {
        const notifications = get().notifications;
        if (!notifications) return 0;

        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        return notifications.filter(notification => new Date(notification.timestamp) >= startOfToday).length;
    },
}));