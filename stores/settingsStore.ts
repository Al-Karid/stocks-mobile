import { useSettingRepository } from "@/data/repositories/settingRepository";
import { UserProfileSettings } from "@/types/settings";
import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

interface SettingsStore {
    userContraintCounts: UserProfileSettings;
    autoUpdatesEnabled: boolean;
    biometricsEnabled: boolean;
    increaseUserContraintCounts: (item: keyof UserProfileSettings) => void;
    decreaseUserContraintCounts: (item: keyof UserProfileSettings) => void;
    setUserContraintCounts: (item: keyof UserProfileSettings, value: number) => void;
    resetUserContraintCounts: (item: keyof UserProfileSettings) => void;
    fetchUserContraintCounts: () => Promise<void>;
    fetchAutoUpdatesEnabled: () => Promise<void>;
    setAutoUpdatesEnabled: (enabled: boolean) => Promise<void>;
    fetchBiometricsEnabled: () => Promise<void>;
    setBiometricsEnabled: (enabled: boolean) => Promise<void>;
}

const { getSettings, updateSetting, saveSetting } = useSettingRepository();

export const useSettingsStore = create<SettingsStore>((set) => ({
    userContraintCounts: {
        userProfile: "free" as "free" | "premium",
        maxPorfolio: 2,
        maxWatchlist: 5,
        maxTransactions: 50,
        maxAlerts: 1
    },    autoUpdatesEnabled: true,
    biometricsEnabled: false,    increaseUserContraintCounts: (item: keyof UserProfileSettings) => {
        set((state) => {
            const updatedCounts = {
                ...state.userContraintCounts,
                [item]: Number(state.userContraintCounts[item]) + 1
            };
            updateSetting({
                key: "userProfileConstraintsCounts",
                value: JSON.stringify(updatedCounts)
            });
            console.log("User profile settings updated:", updatedCounts);
            return { userContraintCounts: updatedCounts };
        });
    },
    decreaseUserContraintCounts: (item: keyof UserProfileSettings) => {
        set((state) => {
            const updatedCounts = {
                ...state.userContraintCounts,
                [item]: Number(state.userContraintCounts[item]) - 1
            };
            updateSetting({
                key: "userProfileConstraintsCounts",
                value: JSON.stringify(updatedCounts)
            });
            console.log("User profile settings updated:", updatedCounts);
            return { userContraintCounts: updatedCounts };
        });
    },
    resetUserContraintCounts: (item: keyof UserProfileSettings) => {
        set((state) => {
            const updatedCounts = {
                ...state.userContraintCounts,
                [item]: 0
            };
            updateSetting({
                key: "userProfileConstraintsCounts",
                value: JSON.stringify(updatedCounts)
            });
            return { userContraintCounts: updatedCounts };
        });
    },
    setUserContraintCounts: (item: keyof UserProfileSettings, value: number) => {
        set((state) => {
            const updatedCounts = {
                ...state.userContraintCounts,
                [item]: value
            };
            updateSetting({
                key: "userProfileConstraintsCounts",
                value: JSON.stringify(updatedCounts)
            });
            return { userContraintCounts: updatedCounts };
        });
    },
    fetchUserContraintCounts: async () => {
        const userProfileSettings = await getSettings("userProfileConstraintsCounts");
        if (!userProfileSettings?.value) {
            console.warn("⚠️ User profile constraints settings not found; keeping defaults");
            return;
        }

        const parsedUserProfileSettings = JSON.parse(userProfileSettings.value) as UserProfileSettings;
        set({ userContraintCounts: parsedUserProfileSettings });
        console.log("User profile settings fetched:", parsedUserProfileSettings);
    },
    fetchAutoUpdatesEnabled: async () => {
        const setting = await getSettings("autoUpdatesEnabled");
        const enabled = setting?.value !== "false";
        set({ autoUpdatesEnabled: enabled });
        console.log("Auto updates preference fetched:", enabled);
    },
    setAutoUpdatesEnabled: async (enabled: boolean) => {
        await saveSetting({ key: "autoUpdatesEnabled", value: enabled ? "true" : "false" });
        set({ autoUpdatesEnabled: enabled });
        console.log("Auto updates preference updated:", enabled);
    },
    fetchBiometricsEnabled: async () => {
        try {
            const value = await SecureStore.getItemAsync("biometricsEnabled");
            const enabled = value === "true";
            set({ biometricsEnabled: enabled });
            console.log("Biometrics preference fetched from SecureStore:", enabled);
        } catch {
            set({ biometricsEnabled: false });
        }
    },
    setBiometricsEnabled: async (enabled: boolean) => {
        try {
            await SecureStore.setItemAsync("biometricsEnabled", enabled ? "true" : "false");
            set({ biometricsEnabled: enabled });
            console.log("Biometrics preference saved to SecureStore:", enabled);
        } catch (e) {
            console.error("Failed to save biometrics preference to SecureStore:", e);
        }
    },
}));