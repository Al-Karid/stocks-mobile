// Define portfolio & holding types
interface Holding {
    id: number;
    updatedAt: string | null;
    symbol: string;
    quantity: number;
    averagePurchasePrice: number;
    currentPrice: number;
    performence: number;
  }

interface Portfolio {
    id: number;
    updatedAt: string | null;
    userId: number;
    name: string;
    holdings: Holding[];
  }