export interface AlertData {
    id: number;
    stock: string;
    type: 'above' | 'below';
    name?: string;
    value: number;
    enabled: boolean;
}