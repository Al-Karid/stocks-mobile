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
  const isGain = type === 'above';

  return (
    <View style={[globalCardStyles.card, isGain ? styles.gainBorder : styles.lossBorder]}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        {type && (
          <View style={[styles.tag, isGain ? styles.gainTag : styles.lossTag]}>
            <Text style={styles.tagText}>{isGain ? 'Hausse' : 'Baisse'}</Text>
          </View>
        )}
      </View>
      <Text style={styles.description} numberOfLines={3}>{description}</Text>
      <Text style={styles.time}>{time}</Text>
    </View>
  );
};

export default NotificationCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  gainBorder: {
    borderLeftWidth: 4,
    borderLeftColor: '#86efac', // soft green
  },
  lossBorder: {
    borderLeftWidth: 4,
    borderLeftColor: '#fca5a5', // soft red
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1f2937', // soft gray-black
    flex: 1,
    marginRight: 10,
  },
  description: {
    color: '#4b5563', // neutral gray
    fontSize: 14,
    marginVertical: 6,
  },
  time: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 2,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  gainTag: {
    backgroundColor: '#ecfdf5',
  },
  lossTag: {
    backgroundColor: '#fef2f2',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
});
