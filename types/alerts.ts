export interface AlertData {
    id: number;
    uuid: string;
    devicePushToken: string | null;
    stockSymbol: string;
    stockTitle: string;
    alertType: AlertType;
    value: number;
    enabled: boolean;
    synced: boolean;
    notificationChannels: string;
    deleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
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

export interface NotificationChannel {
    [key: string]: boolean;
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