import { create } from "zustand";
import { Holding } from "@/types/portfolio";
import { TransactionRequest } from "@/types/portfolioRequest";
import { useHoldingDataService } from "@/data/useHoldingDataService";

interface HoldingStore {
  holdings: Holding[];
  getHoldings: (portfolioId: number) => Promise<Holding[]>;
  addTransaction: (transaction: TransactionRequest) => Promise<void>;
}

const { fetchHoldings, saveTransaction } = useHoldingDataService();

export const useHoldingStore = create<HoldingStore>((set) => ({
  holdings: [],
  
  getHoldings: async (portfolioId: number) => {
    const holdings = await fetchHoldings(portfolioId);
    set({ holdings });
    console.log("🔄 Data loaded from holding store");
    return holdings;
  },
  addTransaction: async (transaction: TransactionRequest) => {
    await saveTransaction(transaction);
    const holdings = await fetchHoldings(transaction.portfolioId);
    set({ holdings });
  },
}));