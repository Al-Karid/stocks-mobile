import { useCallback } from "react";
import { APIStock } from "@/types/stock";
import { saveStocksToDb } from "@/data/databases/stocks";
import { useStockRepository } from "@/data/repositories/stockRepository";
import { useWatchlistStore } from "@/stores/watchlistStore";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { useStockStore } from "@/stores/stockStore";
import { useAlertStore } from "@/stores/alertStore";
import { Storage } from "expo-sqlite/kv-store";
import { useNotificationStore } from "@/stores/notificationStore";

const API_URL = "https://stocks.revalys.com/v1/stocks";

export const useStockSync = () => {

  const { fetchWatchlist } = useWatchlistStore();
  const { fetchPortfolios } = usePortfolioStore();
  const { updateWatchlist } = useStockRepository();
  const { fetchStocks } = useStockStore();
  const { fetchAlerts, getNotificationChannels } = useAlertStore();
  const { fetchNotifications } = useNotificationStore();

  const syncStockDataFromServer = useCallback(async (): Promise<string> => {

    try {

      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("API error");

      const data: APIStock[] = (await response.json()) as APIStock[];
      if (data.length === 0) throw new Error("Empty API response");

      await Storage.setItem("lastSync", data[0].updated_at);

      //1. Save stocks to the database
      await saveStocksToDb(data);

      console.log("💾 Synced stocks from server: " + await Storage.getItem("lastSync"));

      //2. Update watchlist and portfolios
      updateWatchlist();

      //3. Fetch watchlist and portfolios
      await fetchStocks();
      await fetchWatchlist();
      await fetchPortfolios();
      await fetchAlerts();
      await getNotificationChannels();
      await fetchNotifications();

      return data[0].updated_at;
    
    } catch (error) {
      console.error("⚠️ Error syncing stock data:", error);
      return "";
    }
  }, []);

  return { syncStockDataFromServer };
};