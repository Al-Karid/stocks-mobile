import { TransactionType } from "./portfolio";

export interface TransactionRequest {
  portfolioId: number;
  symbol: string;
  type: TransactionType;
  transactionDate?: Date;
  quantity: number;
  pricePerShare: number;
  notes?: string;
  fees: number; // in percentage
}
export interface PortfolioRequest {
  name: string;
}
