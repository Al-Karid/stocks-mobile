import { create } from "zustand";
import { Stock } from "@/types/stock";
import { useStockDataService } from "@/data/stockService";

interface WatchlistStore {
  watchlist: Stock[];
  fetchWatchlist: () => Promise<Stock[]>;
  addStockToWatchlist: (symbol: string) => Promise<void>;
  removeStockFromWatchlist: (symbol: string) => Promise<void>;
}

const { addToWatchlist, removeFromWatchlist, getWatchlistAsStocks } =
  useStockDataService();

export const useWatchlistStore = create<WatchlistStore>((set) => ({
  watchlist: [],

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
