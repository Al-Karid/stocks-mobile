import { TransactionType } from "./portfolio";

export interface PortfolioRequest {
  name: string;
}

export interface HoldingRequest {
  portfolioId: number;
  symbol: string;
  name: string;
  quantity: number;
  averagePrice: number;
  totalCost?: number;
}

export interface TransactionRequest {
  portfolioId: number;
  symbol: string;
  name: string;
  type: TransactionType;
  transactionDate: Date;
  quantity: number;
  pricePerShare: number;
  realPricePerShare: number;
  totalCost: number;
  notes: string | null;
  fees: number; // in percentage
}