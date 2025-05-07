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

// This function should be used inside a component to access the sync method
export const useAppInitializer = () => {

  const { fetchWatchlist } = useWatchlistStore();
  const { fetchPortfolios } = usePortfolioStore();
  // const { updateWatchlist } = useStockRepository();
  const { fetchStocks } = useStockStore();
  const { fetchAlerts, getNotificationChannels, getDevicePushToken } = useAlertStore();
  const { fetchNotifications } = useNotificationStore();
  const { fetchUserContraintCounts } = useSettingsStore();

  const { syncStockDataFromServer } = useStockSync();
  const { getSettings, saveSetting } = useSettingRepository();

  const initializeAppData = async (): Promise<void> => {
    try {
      await initSettingsDb();
      const dbInitialized = await getSettings("databaseInitialized");
      if (dbInitialized.value === "true") {
        console.log("✅ Databases already initializedm skipping initialization");
        console.log("🔄 Loading Stores");
        await fetchStocks();
        await fetchWatchlist();
        await fetchPortfolios();
        await fetchAlerts();
        await fetchNotifications();
        await fetchUserContraintCounts();
      } else {
        console.log("🔄 Initializing databases...");
        await initDb();
        await initPortfolioDb();
        await initAlertDatabase();
        console.log("✅ Databases initialized");
        await syncStockDataFromServer();
        console.log("🔄 Stock data synchronized");
        await saveSetting({ key: "databaseInitialized", value: "true" });
        console.log("✅ Database initialization flag set");
      }
    } catch (err: any) {
      console.error("‼️ Error initializing app:", err);
      throw err;
    }
  };

  return { initializeAppData };
};