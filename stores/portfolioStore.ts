// File: portfolioStore.ts
import { create } from "zustand";
import {
  createPortfolio,
  getPortfolios,
  updatePortfolio,
  deletePortfolio,
} from "../data/portfolioDataService";
import { Portfolio } from "../types/portfolio";

interface PortfolioStore {
  portfolios: Portfolio[];
  fetchPortfolios: () => Promise<Portfolio[]>;
  addPortfolio: (name: string) => Promise<void>;
  renamePortfolio: (id: number, newName: string) => Promise<void>;
  deletePortfolio: (id: number) => Promise<void>;
}

export const usePortfolioStore = create<PortfolioStore>((set) => ({
  portfolios: [],

  fetchPortfolios: async () => {
    const portfolios = await getPortfolios();
    set({ portfolios });
    console.log("🔄 Data loaded from portfolio store");

    return portfolios;
  },

  addPortfolio: async (name: string) => {
    await createPortfolio(name);
    const portfolios = await getPortfolios();
    set({ portfolios });
  },

  renamePortfolio: async (id: number, name: string) => {
    await updatePortfolio(id, name);
    const portfolios = await getPortfolios();
    set({ portfolios });
  },

  deletePortfolio: async (id: number) => {
    await deletePortfolio(id);
    const portfolios = await getPortfolios();
    set({ portfolios });
  },
}));
