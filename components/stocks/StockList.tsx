import React, { useState } from "react";
import { FlatList, StyleSheet, TextInput, View, RefreshControl } from "react-native";
import { stockData } from "@/data/stocks";
import StockCard from "@/components/stocks/StockCard";

const StockList: React.FC = () => {
  const [filterText, setFilterText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Simulate data reload
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500); // Simulated delay (replace with actual data fetching logic)
  };

  const filteredStocks = stockData.filter((stock) =>
    stock.name.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <View style={styles.listContainer}>
      <TextInput
        style={[styles.filterInput, isFocused && styles.filterInputFocused]}
        placeholder="Filter stocks..."
        value={filterText}
        onChangeText={setFilterText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <FlatList
        data={filteredStocks}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#007bff"]} />
        }
        renderItem={({ item }) => (
          <StockCard
            name={item.name}
            currentPrice={item.currentPrice}
            previousClosePrice={item.previousClosePrice}
            percentageChange={item.percentageChange}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
  },
  container: {
    padding: 4,
  },
  filterInput: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
    marginHorizontal: 4,
    backgroundColor: "white",
  },
  filterInputFocused: {
    borderColor: "#007bff",
    borderWidth: 1,
    shadowColor: "#007bff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 1.5,
    elevation: 5, // Glow effect on Android
  },
});

export default StockList;