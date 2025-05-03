// components/AlertNotificationCard.tsx
import { globalCardStyles } from '@/styles/globalStyles';
import { AlertType } from '@/types/alerts';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  title: string;
  description: string;
  time: string;
  type?: AlertType;
};

const NotificationCard = ({ title, description, time, type }: Props) => {
  return (
    <View style={[globalCardStyles.card, type === 'above' ? styles.gain : styles.loss]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.time}>{time}</Text>
    </View>
  );
};

export default NotificationCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  gain: {
    borderLeftWidth: 4,
    borderLeftColor: '#22c55e',
  },
  loss: {
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
  },
  description: {
    color: '#444',
    marginVertical: 4,
  },
  time: {
    color: '#888',
    fontSize: 12,
  },
});
