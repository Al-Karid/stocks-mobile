import { initDb } from '@/data/databases/stocks';
import { initPortfolioDb } from '@/data/databases/portfolios';
import { initAlertDatabase } from '@/data/databases/alerts';
import { initSettingsDb } from '@/data/databases/settings';
import { useStockSync } from '@/data/configs/syncStocks';

// This function should be used inside a component to access the sync method
export const useAppInitializer = () => {
  const { syncStockDataFromServer } = useStockSync();

  const initializeAppData = async (): Promise<void> => {
    try {
      await initDb();
      await initPortfolioDb();
      await initAlertDatabase();
      await initSettingsDb();
      console.log("✅ Databases initialized");

      await syncStockDataFromServer();
      console.log("🔄 Stock data synchronized");
    } catch (err: any) {
      console.error("‼️ Error initializing app:", err);
      throw err;
    }
  };

  return { initializeAppData };
};
