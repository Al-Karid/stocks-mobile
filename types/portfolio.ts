export type TransactionType = "BUY" | "SELL";

export interface Portfolio {
  id: number;
  name: string;
  isDefault?: boolean;
  holdings: Holding[];
  performance: Performance;
  transactions: Transaction[];
}

export interface Performance {
  totalCost: number;
  totalValue: number;
  totalGainLoss: number;
  gainLossPercentage: number;
}

export interface Transaction {
  id: number;
  fees: number;
  notes?: string;
  symbol: string;
  quantity: number;
  totalCost: number;
  portfolioId: number;
  currentPrice: number;
  pricePerShare: number;
  type: TransactionType;
  transactionDate: Date;
  realPricePerShare: number;
}

export interface Holding {
  name: string;
  symbol: string;
  gainLoss: number;
  quantity: number;
  totalCost: number;
  portfolioId: number;
  averagePrice: number;
  currentPrice?: number;
}

export interface PortfolioRequest {
  name: string;
}

export interface HoldingRequest {
  name: string;
  symbol: string;
  quantity: number;
  totalCost?: number;
  portfolioId: number;
  averagePrice: number;
}

export interface TransactionRequest {
  name: string;
  symbol: string;
  quantity: number;
  totalCost: number;
  portfolioId: number;
  type: TransactionType;
  notes: string | null;
  transactionDate: Date;
  pricePerShare: number;
  realPricePerShare: number;
  fees: number; // in percentage
}
