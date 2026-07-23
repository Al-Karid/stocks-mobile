import React, { useCallback } from "react";
import {
  FlatList,
  Text,
  StyleSheet,
  RefreshControl,
  View,
  Platform,
} from "react-native";
import StockCard from "@/components/stocks/StockCard";
import { Stock } from "@/types/stock";
import { useTranslation } from "react-i18next";

interface StockListingProps {
  stocks: Stock[];
  refreshing: boolean;
  onRefresh: () => void;
  onSelectStock?: (symbol: string) => void;
}

const StockListing: React.FC<StockListingProps> = ({ stocks, refreshing, onRefresh, onSelectStock }) => {

  const { t } = useTranslation();

  const renderStockCard = useCallback(({ item }: { item: Stock }) => {
    return (
      <StockCard
        name={item.title.trimStart()}
        symbol={item.symbol}
        currentPrice={item.currentPrice}
        previousClosePrice={item.previousClosePrice}
        percentageChange={item.percentageChange}
        volumeTitles={item.volumeTitles}
        volumeValues={item.volumeValues}
        opening={item.opening}
        high={item.high}
        low={item.low}
        isInWatchlist={item.isInWatchlist ?? false}
        onSelect={onSelectStock}
      />
    );
  }, [onSelectStock]);

  return (
    <FlatList
      data={stocks}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderStockCard}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      initialNumToRender={20}
      maxToRenderPerBatch={5}
      windowSize={5}
      removeClippedSubviews={true}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#007bff"]}
        />
      }
      ListHeaderComponent={() => (
        <Text style={styles.headerText}>
          {stocks.length} {t('stocks').toLocaleLowerCase()}
        </Text>
      )}
      ListEmptyComponent={() => (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t('no-stocks-found')}</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: Platform.select({android: 100, default: undefined}),
    backgroundColor: "#f2f2f2",
  },
  headerText: {
    fontSize: 12,
    marginBottom: 8,
    color: "#888",
    paddingLeft: 2,
  },
  emptyContainer: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: "#666",
    fontSize: 14,
  },
});

export default React.memo(StockListing);