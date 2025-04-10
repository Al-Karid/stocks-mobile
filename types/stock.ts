export interface Stock {
  id: number;
  code: string;
  country: string;
  symbol: string;
  title: string;
  currentPrice: number;
  previousClosePrice: number;
  percentageChange: number;
  volumeTitles: number;
  volumeValues: number;
  opening: number;
  high: number;
  low: number;
  updatedAt: string; // ISO 8601 date string
}

export interface StockDb {
  id: number;
  code: string;
  country: string;
  symbol: string;
  title: string;
  currentPrice: number;
  previousClosePrice: number;
  percentageChange: number;
  volumeTitles: number;
  volumeValues: number;
  opening: number;
  high: number;
  low: number;
  updatedAt: string; // ISO 8601 date string
  isInWatchlist: boolean;
};
