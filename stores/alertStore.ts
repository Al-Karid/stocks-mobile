import { AlertData } from "@/types/alerts";
import { create } from "zustand";
import { useAlertRepository } from "@/data/repositories/alertRepository";
import { NotificationChannel } from "@/types/settings";
import { SettingData } from "@/types/settings";
import { useSettingRepository } from "@/data/repositories/settingRepository";

interface AlertStore {
    alerts: AlertData[] | null;
    devicePushToken: string | null;
    notificationChannels: NotificationChannel;
    fetchAlerts: () => Promise<AlertData[]>;
    addAlert: (alert: AlertData) => void;
    removeAlert: (id: number) => void;
    updateAlert: (alert: AlertData) => void;
    toggleAlertState: (id: number) => void;
    getNotificationChannels: () => Promise<NotificationChannel>;
    getDevicePushToken: () => Promise<string | null>;
    updateNotificationChannel: (channel: string) => void;
}

const { getAlerts, saveAlert, deleteAlert, updateAlert, findAlertById } = useAlertRepository();
const { getSettings, updateSetting } = useSettingRepository();

export const useAlertStore = create<AlertStore>((set, get) => ({
    alerts: null,
    devicePushToken: null,
    notificationChannels: { push: false, sms: false },
    fetchAlerts: async () => {
        const fetchedAlerts = await getAlerts();
        set({ alerts: fetchedAlerts });
        return fetchedAlerts;
    },
    addAlert: async (alert: AlertData) => {
        console.log("🚀 Adding alert:", alert);
        
        await saveAlert(alert).then(async () => {
            const fetchedAlerts = await getAlerts();
            set({ alerts: fetchedAlerts });
        });
    },
    removeAlert: (id: number) => {
        deleteAlert(id).then(async () => {
            const fetchedAlerts = await getAlerts();
            set({ alerts: fetchedAlerts });
        });
    },
    toggleAlertState: (id: number) => {
        set((state) => ({
            alerts: state.alerts?.map((alert) =>
                alert.id === id ? { ...alert, enabled: !alert.enabled } : alert
            ) || null
        }));
        findAlertById(id).then(async (alert) => {
            if (alert) {
                alert.enabled = !alert.enabled;
                await updateAlert(alert); // Persist the update without fetching all alerts again
            }
        });
    },
    updateAlert: async (alert: AlertData) => {
        await updateAlert(alert).then(async () => {
            const fetchedAlerts = await getAlerts();
            set({ alerts: fetchedAlerts });
        });
    },
    getNotificationChannels: async (): Promise<NotificationChannel> => {
        const notificationChannels: SettingData = await getSettings("notificationChannels");
        if (notificationChannels) {
            let channels = JSON.parse(notificationChannels.value);
            channels = channels.reduce((acc: NotificationChannel, channel: any) => {
                acc[channel.key as keyof NotificationChannel] = channel.value;
                return acc;
            }, {} as NotificationChannel);
            set({ notificationChannels: channels });
            return channels;
        } else {
            console.error("‼️ Error fetching notification channels");
            return {} as NotificationChannel;
        }
    },
    updateNotificationChannel: async (channel: string): Promise<void> => {

        set((state) => ({
            notificationChannels: {
                ...state.notificationChannels,
                [channel]: !state.notificationChannels[channel as keyof NotificationChannel],
            },
        }));

        try {
            // 2️⃣ Get the new toggled state
            const currentChannels = get().notificationChannels;

            // 3️⃣ Prepare the data to be saved
            const channelArray = Object.entries(currentChannels).map(([key, value]) => ({
                key,
                value,
            }));

            const setting: SettingData = {
                key: "notificationChannels",
                value: JSON.stringify(channelArray),
            };

            // 4️⃣ Save to persistent storage
            await updateSetting(setting);
        } catch (error) {
            console.error("‼️ Error updating notification channel:", error);
        }
    },
    getDevicePushToken: async (): Promise<string | null> => {
        try {
            const token = await getSettings("devicePushToken");
            if (token) {
                set({ devicePushToken: token.value });
                console.log("✅ Device push token fetched successfully:", token.value);
                return token.value;
            } else {
                console.warn("‼️ Warning: Device push token not found");
                set({ devicePushToken: null });
                return null;
            }
        } catch (error) {
            console.error("‼️ Error fetching device push token:", error);
            return null; 
        }
    }
}));