export type TransactionType = "BUY" | "SELL";

export interface Portfolio {
    id: number;
    name: string;
    holdings: Holding[];
    transactions: Transaction[];
}

export interface Transaction {
  id: number;
  portfolioId: number;
  symbol: string;
  type: TransactionType;
  transactionDate: Date;
  quantity: number;
  pricePerShare: number;
  totalAmount: number;
  fees: number;
  notes?: string;
}

export interface Holding {
  symbol: string;
  name?: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  totalCost?: number;
  gainLoss: number;
}

export interface PortfolioPerformance {
  totalValue: number;
  totalCost: number;
  totalGainLoss: number;
  gainLossPercentage: number;
  dailyChange: number;
}
