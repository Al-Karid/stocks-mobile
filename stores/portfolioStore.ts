import { create } from "zustand";
import { usePortfolioRepository } from "@/data/repositories/portfolioRepository";
import { Portfolio, Transaction } from "@/types/portfolio";
import { Holding } from "@/types/portfolio";
import { TransactionRequest } from "@/types/portfolio";
import { useHoldingRepository } from "@/data/repositories/holdingRepository";
import { useTransactionService } from "@/data/services/transactionService";
import { useTransactionRepository } from "@/data/repositories/transactionRepository";

const { fetchHoldings } = useHoldingRepository();
const { processTransaction } = useTransactionService();
const { fetchTransactions } = useTransactionRepository();
const { createPortfolio, getPortfolios, updatePortfolio, deletePortfolio, getPortfolioById } = usePortfolioRepository();

interface PortfolioStore {
  portfolios: Portfolio[];
  holdings: Holding[];
  fetchPortfolios: () => Promise<Portfolio[]>;
  findPortfolio: (id: number) => Promise<Portfolio | null>;
  addPortfolio: (name: string) => Promise<void>;
  renamePortfolio: (id: number, newName: string) => Promise<void>;
  deletePortfolio: (id: number) => Promise<void>;
  getHoldings: (portfolioId: number) => Promise<Holding[]>;
  addTransaction: (transaction: TransactionRequest) => Promise<void>;
  getTransactions: (portfolioId: number, symbol: string) => Promise<Transaction[]>;
}

export const usePortfolioStore = create<PortfolioStore>((set) => ({
  portfolios: [],
  holdings: [],

  fetchPortfolios: async () => {
    const portfolios = await getPortfolios();
    set({ portfolios });
    console.log("🔄 Data loaded from portfolio store");

    return portfolios;
  },

  findPortfolio: (id: number) => {
    const portfolio = getPortfolioById(id);
    if (!portfolio) {
      throw new Error(`Portfolio with id ${id} not found`);
    }
    return portfolio;
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

  getHoldings: async (portfolioId: number) => {
    const holdings = await fetchHoldings(portfolioId);
    set({ holdings });
    console.log("🔄 Data loaded from holding store");
    return holdings;
  },
  addTransaction: async (transaction: TransactionRequest) => {
    await processTransaction(transaction);
    const holdings = await fetchHoldings(transaction.portfolioId);
    const portfolios = await getPortfolios();
    set({ portfolios });
    set({ holdings });
  },
  getTransactions: async (portfolioId: number, symbol: string) => {
    const transactions = await fetchTransactions(portfolioId, symbol);
    return transactions;
  },
}));
