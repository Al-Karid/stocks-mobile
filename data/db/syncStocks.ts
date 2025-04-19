import { APIStock, Stock } from "@/types/stock";
import { saveStocksToDb } from "@/data/db/stockDatabase";
import { useStockRepository } from "@/data/repositories/stockRepository";
import { Storage } from "expo-sqlite/kv-store"

// const API_URL = "http://192.168.1.7:8088/api/v1/web/stocks";
const API_URL = "https://stocks.revalys.com/v1/stocks";

const { updateWatchlist } = useStockRepository();

export const syncStockDataFromServer = async (): Promise<string> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("API error");

    const data: APIStock[] = (await response.json()) as APIStock[];
    if (data.length === 0) throw new Error("Empty API response");

    await Storage.setItem("lastSync", data[0].updated_at);

    saveStocksToDb(data);
    // data.forEach((stock) => {});
    console.log("💾 Synced stocks from server: " + await Storage.getItem("lastSync"));

    updateWatchlist();
    console.log("💾 Updated watchlist");
    return data[0].updated_at;
  } catch (error) {
    console.error("⚠️ Error syncing stock data:", error);
    return "";
  }
};