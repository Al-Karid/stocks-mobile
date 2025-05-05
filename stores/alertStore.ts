import { AlertData } from "@/types/alerts";
import { create } from "zustand";
import { useAlertRepository } from "@/data/repositories/alertRepository";
import { NotificationChannel } from "@/types/settings";
import { SettingData } from "@/types/settings";
import { useSettingRepository } from "@/data/repositories/settingRepository";
import { ALERT_ENDPOINT } from "@/env";
import { Alert } from "react-native";

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

        await fetch(ALERT_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(alert),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(async (data) => {
                console.log("✅ Alert added successfully:", data);
                alert.synced = true;
                await saveAlert(alert).then(async () => {
                    const fetchedAlerts = await getAlerts();
                    set({ alerts: fetchedAlerts });
                });
            })
            .catch((error) => {
                console.error("‼️ Error adding alert:", error);
            });
    },

    removeAlert: (id: number) => {
        findAlertById(id).then(async (alert) => {
            if (alert) {
                alert.deleted = true;
                alert.deletedAt = new Date().toISOString();
                alert.enabled = false;
                await fetch(ALERT_ENDPOINT + "/" + alert.uuid, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        deleted: true,
                        deletedAt: new Date().toISOString(),
                        enabled: false,
                    }),
                }).then((response) => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    deleteAlert(id).then(async () => {
                        const fetchedAlerts = await getAlerts();
                        set({ alerts: fetchedAlerts });
                    });
                }).catch((error) => {
                    // console.error("‼️ Error deleting alert:", error);
                    Alert.alert(
                        "Error",
                        "An error occurred while deleting the alert. Please try again.",
                        [{ text: "OK" }]
                    );
                });
            } else {
                console.error("‼️ Alert not found:", id);
            }
        });
    },

    toggleAlertState: async (id: number) => {
        const state = get(); // access current state
        const alert = state.alerts?.find((a) => a.id === id);

        if (!alert) return;

        const originalEnabled = alert.enabled;
        const newEnabled = !originalEnabled;

        // Step 1: Optimistically update local state
        set({
            alerts: state.alerts?.map((a) =>
                a.id === id ? { ...a, enabled: newEnabled } : a
            ) || null
        });

        // Step 2: Attempt remote update
        await fetch(ALERT_ENDPOINT + "/" + alert.uuid, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                enabled: newEnabled,
            }),
        }).then(async (response) => {
            if (!response.ok) {
                console.log("🚀 Response:", response);
                throw new Error("Network response was not ok");
            }

            const updatedAlert = { ...alert, enabled: newEnabled };
            await updateAlert(updatedAlert);
        }).catch((error) => {
            set({
                alerts: state.alerts?.map((a) =>
                    a.id === id ? { ...a, enabled: originalEnabled } : a
                ) || null
            });
            console.error("‼️ Error updating alert state:", error);
            Alert.alert(
                "Error",
                "An error occurred while updating the alert state. Please try again.",
                [{ text: "OK" }]
            );
        });
    },

    updateAlert: async (alert: AlertData) => {
        console.log("🚀 Updating alert:", alert);
        await fetch(ALERT_ENDPOINT + "/" + alert.uuid, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                alertType: alert.alertType,
                value: alert.value,
                enabled: alert.enabled,
                updatedAt: alert.updatedAt,
            }),
        }).then(async (response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            console.log(response.json());

            await updateAlert(alert).then(async () => {
                const fetchedAlerts = await getAlerts();
                set({ alerts: fetchedAlerts });
            });
        }).catch((error) => {
            console.error("‼️ Error updating alert:", error);
            Alert.alert(
                "Error",
                "An error occurred while updating the alert. Please try again.",
                [{ text: "OK" }]
            );
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