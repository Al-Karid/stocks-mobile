import { useEffect, useState } from 'react';
import { initDb } from '@/data/databases/stocks';
import { initPortfolioDb } from '@/data/databases/portfolios';
import { useStockSync } from '@/data/configs/syncStocks';

export const useInitDatabases = () => {

  const { syncStockDataFromServer } = useStockSync();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initDb();
        await initPortfolioDb();
        console.log("✅ Databases initialized");

        await syncStockDataFromServer();
        console.log("🔄 Stock data synchronized");

      } catch (err: any) {
        console.error("‼️ Error initializing app:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  return { loading, error };
};