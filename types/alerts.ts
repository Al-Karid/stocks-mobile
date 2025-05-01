export interface AlertData {
    id: number;
    stockSymbol: string;
    type: 'above' | 'below';
    stockTitle?: string;
    value: number;
    enabled: boolean;
}