export interface StockHistoryEntry {
  date: string;
  closing: number;
}

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
  updatedAt: string;
  isInWatchlist?: boolean;
  rsi?: number | null;
}

export interface APIStock {
  code: string;
  country: string;
  symbol: string;
  title: string;
  current_price: number;
  previous_close_price: number;
  volume_titles: number;
  volume_values: number;
  opening: number;
  high: number;
  low: number;
  updated_at: string;
  rsi?: number | null;
  history?: StockHistoryEntry[];
}