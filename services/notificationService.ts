// hooks/useNotificationHandler.ts
import { Notification, NotificationDataApiResponse } from '@/types/alerts';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useNotificationStore } from '@/stores/notificationStore';

export function useNotificationHandler() {
  const router = useRouter();
  const { addNotification } = useNotificationStore();

  const handleNotification = (notification: Notifications.Notification) => {
    const id = notification.request.identifier;
    const { title, body, data } = notification.request.content;
    const typedData = data as NotificationDataApiResponse;

    const notificationToSave: Notification = {
      id,
      title: title ?? '',
      body: body ?? '',
      notification_type: typedData.alert_type,
      stock_symbol: typedData.stock_symbol,
      timestamp: typedData.timestamp,
    };

    addNotification(notificationToSave);
  };

  useEffect(() => {
    // ✅ Handle case when app is launched by tapping a notification (cold start)
    (async () => {
      const lastNotificationResponse = await Notifications.getLastNotificationResponseAsync();
      if (lastNotificationResponse) {
        handleNotification(lastNotificationResponse.notification);

        const data = lastNotificationResponse.notification.request.content.data as NotificationDataApiResponse;
        if (data.stock_symbol) {
          router.push({ pathname: "/stocks/details", params: { symbol: data.stock_symbol } });
        }
      }
    })();

    // ✅ Listen to new notifications (received while app is open)
    const receivedSubscription = Notifications.addNotificationReceivedListener(notification => {
      handleNotification(notification);
    });

    // ✅ Listen to user interacting with notifications
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      handleNotification(response.notification);

      const data = response.notification.request.content.data as NotificationDataApiResponse;
      if (data.stock_symbol) {
        router.push({ pathname: "/stocks/details", params: { symbol: data.stock_symbol } });
      }
    });

    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  }, []);
}
