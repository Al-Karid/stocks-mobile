// hooks/useNotificationHandler.ts
import { Notification, NotificationDataApiResponse } from '@/types/alerts';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useNotificationStore } from '@/stores/notificationStore';

export function useNotificationHandler() {

  const router = useRouter();
  const { addNotification } = useNotificationStore();

  const handleNotification = async (notification: Notifications.Notification) => {
    const id = notification.request.identifier;
    const { title, body } = notification.request.content;
    const data = notification.request.content.data as NotificationDataApiResponse;

    const notificationToSave: Notification = {
      id: id,
      title: title ?? '',
      body: body ?? '',
      notification_type: data.alert_type,
      stock_symbol: data.stock_symbol,
      timestamp: data.timestamp,
    };
    addNotification(notificationToSave);
  }

  useEffect(() => {
    // When user interacts with notification
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data as NotificationDataApiResponse;
      handleNotification(response.notification);

      if (data.stock_symbol) {
        router.push({ pathname: "/stocks/details", params: { symbol: data.stock_symbol } });
      }
    });

    // When notification is received (but not clicked)
    const receivedSubscription = Notifications.addNotificationReceivedListener(notification => {
      handleNotification(notification);
    });

    return () => {
      responseSubscription.remove();
      receivedSubscription.remove();
    };
  }, []);

}
