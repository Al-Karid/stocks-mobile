import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { provideHapticFeedback } from '@/utils/interactionUtils';
import { useTranslation } from 'react-i18next';

const EmptyWatchlistCard: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Ionicons name="star-outline" size={28} color="#8b5cf6" />
      </View>
      <Text style={styles.title}>{t('empty-watchlist-title')}</Text>
      <Text style={styles.text}>{t('empty-watchlist-text')}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          provideHapticFeedback();
          router.push('/stocks');
        }}
      >
        <Ionicons name="add" size={16} color="#ffffff" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>{t('browse-stocks')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f3f0ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  text: {
    marginTop: 4,
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
  },
  button: {
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#111827',
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default EmptyWatchlistCard;
