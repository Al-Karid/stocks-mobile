// screens/StockList.tsx
import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { stockData } from "@/data/stocks";
import StockCard from "@/components/stocks/StockCard";

const StockList: React.FC = () => (
  <FlatList
    data={stockData}
    keyExtractor={(item) => item.id.toString()}
    contentContainerStyle={styles.container}
    renderItem={({ item }) => (
      <StockCard
        name={item.name}
        currentPrice={item.currentPrice}
        previousClosePrice={item.previousClosePrice}
        percentageChange={item.percentageChange}
      />
    )}
  />
);

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
});

export default StockList;