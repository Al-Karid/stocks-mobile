import { useEffect, useState } from 'react';
import { View, Pressable, Text, FlatList, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useStockRepository } from '@/data/repositories/stockRepository';
import { Stock } from '@/types/stock';
import { useTranslation } from 'react-i18next';

export default function ChooseStockScreen() {
  const { t } = useTranslation();
  const { portfolioId } = useLocalSearchParams();
  const { fetchStocks } = useStockRepository();
  const [stocks, setStocks] = useState<Stock[]>([]);

  useEffect(() => {
    fetchStocks().then(setStocks);
  }, []);

  const handleSelect = (symbol: string) => {
    const stock = stocks.find((s) => s.symbol.trim() === symbol.trim());
    router.back();
    router.push({
      pathname: '/transactions/new',
      params: {
        portfolioId,
        symbol,
        title: stock?.title,
      },
    });
  };

  const renderStockItem = ({ item }: { item: Stock }) => (
    <Pressable
      onPress={() => handleSelect(item.symbol)}
      style={({ pressed }) => [
        styles.stockItem,
        pressed && styles.stockItemPressed,
      ]}
    >
      <Text style={styles.stockItemText}>{item.title}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={stocks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderStockItem}
        contentContainerStyle={{ paddingBottom: 70 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  stockItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0.15,
  },
  stockItemPressed: {
    backgroundColor: '#f0f0f0',
  },
  stockItemText: {
    fontSize: 16,
    color: '#333',
  },
});
