import { Stock } from "@/types/stock";
import { create } from "zustand";
import { useStockRepository } from "@/data/repositories/stockRepository";

interface StockStore {
    stocks: Stock[];
    fetchStocks: () => Promise<Stock[]>;
}

const { fetchStocks: getStocks } = useStockRepository();

export const useStockStore = create<StockStore>((set) => ({
    stocks: [],
    fetchStocks: async () => {
        const response = await getStocks();
        set({ stocks: response });
        console.log("🔄 Data loaded from stock store");
        return response;
    }
}));