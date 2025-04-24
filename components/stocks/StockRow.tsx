import React from 'react';
import { View, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { Stock } from '@/types/stock';
import { formatCurrency, formatNumber, formatPercentage, isPositiveNumber } from '@/utils/numberUtils';
import { router } from 'expo-router';

interface StockRowProps {
  stock: Stock;
}

const StockRow: React.FC<StockRowProps> = ({ stock }) => {
  const { title, symbol, currentPrice, previousClosePrice } = stock;
  const isPositive = isPositiveNumber(currentPrice - previousClosePrice);
  const changeRaw = ((currentPrice - previousClosePrice) / previousClosePrice) * 100;
  const change = formatPercentage(changeRaw, 2);

  return (
    <TouchableOpacity style={styles.card} onLongPress={() => {router.push({ pathname: '/stocks/details', params: { symbol: stock.symbol } })}}>
      <View style={styles.row}>
        <View style={styles.leftSection}>
          <Text style={styles.symbol}>{symbol}</Text>
          <Text style={styles.company}>{title}</Text>
        </View>
        <View style={styles.rightSection}>
          <Text style={isPositive ? styles.changePositive : styles.changeNegative}>
            {isPositive ? '▲' : '▼'} {change}
          </Text>
          <Text style={styles.price}>{formatCurrency(currentPrice)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    marginVertical: 6
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  symbol: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151', // gray-700
    marginBottom: 3,
  },
  company: {
    fontSize: 12,
    color: '#6b7280', // gray-500
    marginTop: 2,
  },
  price: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280', // gray-500
    marginTop: 2,
  },
  changePositive: {
    color: '#16a34a', // green-600
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 3,
  },
  changeNegative: {
    color: '#dc2626', // red-600
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 3,
  },
});

export default StockRow;
