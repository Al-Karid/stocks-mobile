// screens/NotificationScreen.tsx
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, SectionList } from 'react-native';
import NotificationCard from '@/components/alerts/NotificationCard';
import { useNotificationStore } from '@/stores/notificationStore';
import { groupNotifications } from '@/utils/notificationUtils';


const NotificationScreen = () => {
  
  const { notifications } = useNotificationStore();
  const grouped = useMemo(() => groupNotifications(notifications ?? []), [notifications]);
  
  return (
    <View style={styles.container}>
      {/* <Text style={styles.header}>Notifications</Text> */}
      <SectionList
        sections={grouped}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationCard
            title={item.title}
            description={item.body}
            time={item.timestamp}
            type={item.notification_type}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={() => (
          <View style={{ flex: 1, margin: 20, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, color: '#888' }}>No notifications yet</Text>
          </View>
        )}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
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
