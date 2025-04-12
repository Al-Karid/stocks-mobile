import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  RefreshControl,
} from "react-native";
import StockCard from "@/components/stocks/StockCard";
import { Stock } from "@/types/stock";
import { getStocks } from "@/data/stockDataService";

interface StockListingProps {
  stocks: Stock[];
  refreshing: boolean;
  onRefresh: () => void;
};

const StockListing: React.FC<StockListingProps> = ({stocks, refreshing, onRefresh}) => {
  //const [refreshing, setRefreshing] = useState(false);

  return (
    <FlatList
      data={stocks}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#007bff"]}
        />
      }
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
          isInWatchlist={item.isInWatchlist}
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

export default StockListing;
