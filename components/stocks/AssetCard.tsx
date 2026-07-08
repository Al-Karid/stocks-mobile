import { Holding } from '@/types/portfolio';
import { provideHapticFeedback } from '@/utils/interactionUtils';
import { formatCurrency, formatPercentage } from '@/utils/numberUtils';
import { router } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AssetCardProps {
  holding: Holding;
}

const AssetCard: React.FC<AssetCardProps> = ({ holding }) => {
  const { symbol: ticker, gainLoss: amount, totalCost, portfolioId } = holding;
  const isPositive = amount >= 0;
  const change = totalCost ? ((amount / totalCost) * 100) : 0;

  return (
    <TouchableOpacity
      style={styles.wrapper}
      onLongPress={() => {
        provideHapticFeedback();
        router.push({ pathname: '/portfolio/holdings', params: { portfolioId } });
      }}
      activeOpacity={0.7}
    >
      <View style={styles.card}>
        <View style={styles.topRow}>
          <View style={styles.tickerBadge}>
            <Text style={styles.tickerText}>{ticker}</Text>
          </View>
          <Ionicons
            name={isPositive ? 'trending-up' : 'trending-down'}
            size={18}
            color={isPositive ? '#16a34a' : '#dc2626'}
          />
        </View>

        <Text style={styles.amount}>{formatCurrency(amount, 0, 'XOF', false)}</Text>

        <View style={styles.bottomRow}>
          <View style={[styles.changeBadge, isPositive ? styles.changeBadgePositive : styles.changeBadgeNegative]}>
            <Text style={[styles.changeText, isPositive ? styles.changeTextPositive : styles.changeTextNegative]}>
              {formatPercentage(change, 2)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginRight: 10,
    marginTop: 10,
  },
  card: {
    minWidth: 140,
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#ffffff',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tickerBadge: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tickerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1f2937',
    letterSpacing: 0.5,
  },
  amount: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'right',
  },
  bottomRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  changeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  changeBadgePositive: {
    backgroundColor: '#dcfce7',
  },
  changeBadgeNegative: {
    backgroundColor: '#fee2e2',
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  changeTextPositive: {
    color: '#16a34a',
  },
  changeTextNegative: {
    color: '#dc2626',
  },
});

export default AssetCard;
