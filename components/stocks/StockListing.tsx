import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  TextInput,
  View,
  Text,
  RefreshControl,
} from "react-native";
import StockCard from "@/components/stocks/StockCard";
import { Stock } from "@/types/stock";
import { formatLocalDate } from "@/utils/dateUtils";
import { getStocks } from "@/data/stockDataService";

const StockListing: React.FC = () => {
  const [filterText, setFilterText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [updatedAt, setUpdatedAt] = useState("");
  const [stocks, setStocks] = useState<Stock[]>([]);

  const fetchStockData = async () => {
    setRefreshing(true);
    try {
      const data = await getStocks();
      setStocks(data);
      setUpdatedAt(data[0].updatedAt);
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStockData();
  }, []);

  const filteredStocks = stocks.filter((stock) =>
    stock.title.toLowerCase().includes(filterText.toLowerCase())
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
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchStockData}
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
      <Text style={styles.dateText}>
        Données du {formatLocalDate(updatedAt)}
      </Text>
      {/* <Toast /> */}
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
  dateText: {
    fontSize: 12,
    color: "#12345678",
    marginBottom: 8,
    paddingHorizontal: 5,
    paddingTop: 10,
    paddingBottom: 2,
    textAlign: "center",
    borderTopColor: "#12345678",
  },
});

export default StockListing;
