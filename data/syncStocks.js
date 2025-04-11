import { saveStocktoDb } from "./db/stockDb";
import { updateWatchlist } from "./stockDataService";

const API_URL = "http://192.168.43.93:8088/api/v1/web/stocks";

export const syncStockDataFromServer = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("API error");

    const data = await response.json();
    if (data.length === 0) throw new Error("Empty API response");

    data.forEach((stock) => {
      saveStocktoDb(stock);
    });
    console.log("💾 Saved all stocks to db");

    updateWatchlist();
    console.log("💾 Updated watchlist");
  } catch (error) {
    showToast("Failed to load API data. Using local stock data.", "error");
  } finally {
  }
};
