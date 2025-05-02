// screens/NotificationScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, SectionList } from 'react-native';
import NotificationCard from '@/components/alerts/NotificationCard';

type NotificationType = 'gain' | 'loss';

type Notification = {
  id: string;
  title: string;
  description: string;
  time: string;
  type: NotificationType;
};

type NotificationSection = {
  title: string;
  data: Notification[];
};

const fakeNotifications: NotificationSection[] = [
  {
    title: 'Today',
    data: [
      {
        id: '1',
        title: 'MTN CI crossed +5%',
        description: 'MTN CI reached 9,450 FCFA (+5.2%)',
        time: '10:14 AM',
        type: 'gain',
      },
      {
        id: '2',
        title: 'PALM CI fell below 2,000 FCFA',
        description: 'PALM CI dropped to 1,980 FCFA (-3.5%)',
        time: '09:22 AM',
        type: 'loss',
      },
    ],
  },
  {
    title: 'Yesterday',
    data: [
      {
        id: '3',
        title: 'SOGB CI exceeded your target',
        description: 'SOGB CI went above 3,500 FCFA',
        time: '4:32 PM',
        type: 'gain',
      },
    ],
  },
];

const NotificationScreen = () => {
  return (
    <View style={styles.container}>
      {/* <Text style={styles.header}>Notifications</Text> */}
      <SectionList
        sections={fakeNotifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationCard
            title={item.title}
            description={item.description}
            time={item.time}
            type={item.type}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#f1f5f9',
    paddingHorizontal: 16,
    // paddingTop: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 6,
    color: 'gray',
    paddingLeft: 8,
  },
  notificationUnread: {
    backgroundColor: '#e0f7fa', // Light blue background for unread notifications
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  notificationRead: {
    backgroundColor: '#ffffff', // White background for read notifications
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
});
