import { initDb } from '@/data/databases/stocks';
import { initPortfolioDb } from '@/data/databases/portfolios';
import { initAlertDatabase } from '@/data/databases/alerts';
import { initSettingsDb } from '@/data/databases/settings';
import { useStockSync } from '@/data/configs/syncStocks';
import { useSettingRepository } from '../repositories/settingRepository';
import { useWatchlistStore } from '@/stores/watchlistStore';
import { usePortfolioStore } from '@/stores/portfolioStore';
import { useUserStore } from '@/stores/userStore';
import { useAlertStore } from '@/stores/alertStore';
import { useStockStore } from '@/stores/stockStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { isDatabaseInitializedSetting } from '@/data/configs/databaseInitState';
import * as Updates from 'expo-updates';

// This function should be used inside a component to access the sync method
export const useAppInitializer = () => {

  const { fetchWatchlist } = useWatchlistStore();
  const { fetchPortfolios } = usePortfolioStore();
  // const { updateWatchlist } = useStockRepository();
  const { fetchStocks } = useStockStore();
  const { fetchAlerts, getNotificationChannels, getDevicePushToken } = useAlertStore();
  const { fetchNotifications } = useNotificationStore();
  const { fetchUserContraintCounts, fetchAutoUpdatesEnabled } = useSettingsStore();

  const { syncStockDataFromServer } = useStockSync();
  const { getSettings, saveSetting } = useSettingRepository();

  const initializeAppData = async (): Promise<void> => {
    try {
      await initSettingsDb();

      const dbInitializedSetting = await getSettings("databaseInitialized").catch(() => null);
      const isInitialized = isDatabaseInitializedSetting(dbInitializedSetting?.value ?? null);

      if (isInitialized) {
        console.log("✅ Databases already initialized; skipping initialization");
        console.log("🔄 Loading Stores");
        await fetchStocks();
        await fetchWatchlist();
        await fetchPortfolios();
        await fetchAlerts();
        await fetchNotifications();
        await fetchUserContraintCounts();
        await fetchAutoUpdatesEnabled();
        await getNotificationChannels();
        await getDevicePushToken();
        console.log("✅ Stores loaded");
        return;
      }

      const devicePushToken = await getSettings("devicePushToken").catch(() => null);
      if (!devicePushToken?.value || devicePushToken.value === "" || devicePushToken.value === "null" || devicePushToken.value === "undefined" || devicePushToken.value === null) {
        console.log("🔄 Device push token not found, generating a new one...");
        const newDevicePushToken = await getDevicePushToken();
        await saveSetting({ key: "devicePushToken", value: newDevicePushToken || "" });
        await getNotificationChannels();
      }

      console.log("🔄 Initializing databases...");
      await initDb();
      await initPortfolioDb();
      await initAlertDatabase();
      console.log("✅ Databases initialized");
      await syncStockDataFromServer();
      await fetchUserContraintCounts();
      await fetchAutoUpdatesEnabled();
      console.log("🔄 Stock data synchronized");
      await saveSetting({ key: "databaseInitialized", value: "true" });
      console.log("✅ Database initialization flag set");

      const autoUpdatesEnabledSetting = await getSettings("autoUpdatesEnabled").catch(() => null);
      const shouldAutoUpdate = autoUpdatesEnabledSetting?.value !== "false";
      if (shouldAutoUpdate) {
        try {
          const update = await Updates.checkForUpdateAsync();
          if (update.isAvailable) {
            await Updates.fetchUpdateAsync();
            await Updates.reloadAsync();
          }
        } catch (updateError) {
          console.warn("⚠️ Auto-update check failed:", updateError);
        }
      }
    } catch (err: any) {
      console.error("‼️ Error initializing app:", err);
      throw err;
    }
  };

  return { initializeAppData };
};