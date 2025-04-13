import { StockResponse } from "@/types/stock";
import { saveStocktoDb } from "./db/stockDb";
import { updateWatchlist } from "./stockDataService";
import { Storage } from "expo-sqlite/kv-store"

const API_URL = "http://192.168.1.5:8088/api/v1/web/stocks";

export const syncStockDataFromServer = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("API error");

    const data: StockResponse[] = await response.json();
    if (data.length === 0) throw new Error("Empty API response");
    
    await Storage.setItem("lastSync", data[0].updatedAt);

    data.forEach((stock) => {
      saveStocktoDb(stock);
    });
    console.log("💾 Synced stocks from server: " + await Storage.getItem("lastSync"));

    updateWatchlist();
    console.log("💾 Updated watchlist");
  } catch (error) {
    console.error("⚠️ Error syncing stock data:", error);
  } finally {
  }
};
