export interface AlertData {
    id: number;
    stockSymbol: string;
    type: 'above' | 'below';
    stockTitle?: string;
    value: number;
    enabled: boolean;
}

export type AlertType = 'above' | 'below';

export interface Notification {
    id: string;
    title: string;
    body: string;
    notification_type: AlertType;
    stock_symbol: string;
    timestamp: string; // ISO 8601 format e.g., "2023-10-01T12:00:00Z"
}

export interface NotificationDataApiResponse {
    alert_type: AlertType;
    stock_symbol: string;
    timestamp: string;
}

export interface NotificationSection {
    title: 'Today' | 'Earlier';
    data: Notification[];
}