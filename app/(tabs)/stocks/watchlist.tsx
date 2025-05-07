import StockCard from "@/components/stocks/StockCard";
import { useWatchlistStore } from "@/stores/watchlistStore";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, StyleSheet, FlatList } from "react-native";

const WatchlistScreen: React.FC = () => {

  const { t } = useTranslation();

  const { watchlist, fetchWatchlist } = useWatchlistStore();
  const [updatedAt, setUpdatedAt] = useState<string>("");

  const fetchStockData = async () => {
    await fetchWatchlist();
    setUpdatedAt(watchlist[0].updatedAt);
  };

  useEffect(() => {
    fetchStockData();
  }, []);

  return (
    <FlatList
      data={watchlist}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
      ListEmptyComponent={() => (
        <Text
          style={{
            textAlign: "center",
            marginTop: 20,
            fontStyle: "italic",
            color: "#888",
          }}
        >
          {t('select-a-stock-to-add-to-your-watchlist')}
        </Text>
      )}
      renderItem={({ item }) => (
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
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});

export default WatchlistScreen;
