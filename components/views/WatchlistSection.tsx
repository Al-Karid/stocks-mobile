import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StockRow from '@/components/stocks/StockRow';
import EmptyWatchlistCard from '@/components/stocks/EmptyWatchlistCard';
import { useWatchlistStore } from '@/stores/watchlistStore';
import { useRouter } from 'expo-router';
import { provideHapticFeedback } from '@/utils/interactionUtils';
import { useTranslation } from 'react-i18next';

interface WatchlistSectionProps {
  onSelectStock?: (symbol: string) => void;
}

const WatchlistSection: React.FC<WatchlistSectionProps> = ({ onSelectStock }) => {
  const { t } = useTranslation();
  const { watchlist: watchlistStore } = useWatchlistStore();
  const router = useRouter();

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t('my-watchlist')}</Text>
        <TouchableOpacity onPress={() => { provideHapticFeedback(); router.push('/stocks'); }}>
          <Ionicons name="add-circle-outline" size={24} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {watchlistStore.length > 0 ? (
        watchlistStore.slice(0, 5).map((stock) => (
          <StockRow key={stock.id} stock={stock} onSelect={onSelectStock} />
        ))
      ) : (
        <EmptyWatchlistCard />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: 'gray',
  },
});

export default WatchlistSection;