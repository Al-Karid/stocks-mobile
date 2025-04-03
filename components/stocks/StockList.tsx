import React, { useEffect, useState } from "react";
import { 
  FlatList, 
  StyleSheet, 
  TextInput, 
  View, 
  RefreshControl 
} from "react-native";
import Toast from "react-native-toast-message";
import { stockData as localStockData } from "@/data/stocks";
import StockCard from "@/components/stocks/StockCard";

const API_URL = "http://192.168.1.4:8088/api/web/stocks";

const StockList: React.FC = () => {
  const [filterText, setFilterText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [stocks, setStocks] = useState(localStockData);

  const showToast = (message: string, type: "success" | "error") => {
    Toast.show({
      type,
      text1: message,
      position: "bottom",
      visibilityTime: 3000,
    });
  };

  const fetchStockData = async () => {
    setRefreshing(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("API error");

      const data = await response.json();
      if (data.length === 0) throw new Error("Empty API response");

      setStocks(data);
      showToast("Stock data loaded from API", "success");
    } catch (error) {
      setStocks(localStockData);
      showToast("Failed to load API data. Using local stock data.", "error");
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchStockData} colors={["#007bff"]} />
        }
        renderItem={({ item }) => (
          <StockCard
            name={item.title.trimStart()}
            symbol={item.symbol}
            currentPrice={item.currentPrice}
            previousClosePrice={item.previousClosePrice}
            percentageChange={item.percentageChange}
          />
        )}
      />
      <Toast />
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