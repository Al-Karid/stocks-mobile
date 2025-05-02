import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Button } from 'react-native';
import * as Notifications from 'expo-notifications';
import { getDevicePushToken } from '@/services/pushTokenService';

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState<Notifications.Notification>();
  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  useEffect(() => {
    getDevicePushToken()
      .then(token => {
        setExpoPushToken(token ?? '')
        console.log('Push token:', token);})
      .catch(err => console.error(err));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Your push token: {expoPushToken}</Text>
      <Text>Title: {notification?.request.content.title}</Text>
      <Text>Body: {notification?.request.content.body}</Text>
      <Button
        title="Send Notification"
        onPress={async () => {
          if (!expoPushToken) return;
          await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: expoPushToken,
              sound: 'default',
              title: 'PALM CI fell below 2,000 FCFA',
              body: 'PALM CI dropped to 1,980 FCFA (-3.5%)',
            }),
          });
        }}
      />
    </View>
  );
}
