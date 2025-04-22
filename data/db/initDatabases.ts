import { useEffect, useState } from 'react';
import { initDb } from '@/data/db/stockDatabase';
import { initPortfolioDb } from '@/data/db/portfolioDatabase';
import { syncStockDataFromServer } from '@/data/db/syncStocks';
import { useWatchlistStore } from '@/stores/watchlistStore';
import { usePortfolioStore } from '@/stores/portfolioStore';

export const useInitDatabases = () => {
  const { fetchWatchlist } = useWatchlistStore();
  const { fetchPortfolios } = usePortfolioStore();
  const [loading, setLoading] = useState(true); // facultatif pour suivre si tout est prêt
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initDb();
        await initPortfolioDb();
        console.log("✅ Databases initialized");

        await syncStockDataFromServer();
        console.log("🔄 Stock data synchronized");

        await fetchWatchlist();
        await fetchPortfolios();
        console.log("📚 Watchlist and portfolios fetched");

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