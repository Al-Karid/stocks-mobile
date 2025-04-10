import { create } from "zustand";
import { StockDb } from "../types/stock";
import {
  getWatchlistAsStocks,
  addToWatchlist,
  removeFromWatchlist,
} from "../data/stockDataService";

interface WatchlistStore {
    watchlist: StockDb[];
    fetchWatchlist: () => Promise<StockDb[]>;
    addStockToWatchlist: (symbol: string) => Promise<void>;
    removeStockFromWatchlist: (symbol: string) => Promise<void>;
}

export const useWatchlistStore = create<WatchlistStore>((set) => ({
  watchlist:[],

  fetchWatchlist: async () => {
    const stocks = await getWatchlistAsStocks();
    set({ watchlist: stocks });
    console.log("🔄 Data loaded from watchlist store");
    
    return stocks;
  },

  addStockToWatchlist: async (symbol: string) => {
    await addToWatchlist(symbol);
    const stocks = await getWatchlistAsStocks();
    set({ watchlist: stocks });
  },

  removeStockFromWatchlist: async (symbol: string) => {
    await removeFromWatchlist(symbol);
    const stocks = await getWatchlistAsStocks();
    set({ watchlist: stocks });
  },
}));
