import { Stock } from "@/types/stock";
import { saveStocktoDb } from "@/data/db/stockDatabase";
import { useStockDataService } from "@/data/stockService";
import { Storage } from "expo-sqlite/kv-store"

const API_URL = "http://192.168.1.5:8088/api/v1/web/stocks";

const { updateWatchlist } = useStockDataService();

export const syncStockDataFromServer = async (): Promise<string> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("API error");

    const data: Stock[] = await response.json();
    if (data.length === 0) throw new Error("Empty API response");

    await Storage.setItem("lastSync", data[0].updatedAt);

    data.forEach((stock) => {
      saveStocktoDb(stock);
    });
    console.log("💾 Synced stocks from server: " + await Storage.getItem("lastSync"));

    updateWatchlist();
    console.log("💾 Updated watchlist");
    return data[0].updatedAt;
  } catch (error) {
    console.error("⚠️ Error syncing stock data:", error);
    return "";
  }
};
