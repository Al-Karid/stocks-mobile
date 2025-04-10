import { saveStocktoDb } from "./db";
import { updateWatchlist } from "./stockDataService";

const API_URL = "http://192.168.1.3:8088/api/v1/web/stocks";

export const syncStockDataFromServer = async () => {
    const response = await fetch(API_URL);

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
}