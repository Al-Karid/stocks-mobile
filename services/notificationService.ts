// hooks/useNotificationHandler.ts
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export function useNotificationHandler() {
  const router = useRouter();

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const symbol = response.notification.request.content.data.symbol;
      if (symbol) {
        router.push({pathname: "/stocks/details", params: {symbol}});
      }
    });

    return () => subscription.remove();
  }, []);
}
