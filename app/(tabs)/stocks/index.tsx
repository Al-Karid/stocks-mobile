import StockListing from "@/components/stocks/StockListing";
import { FontAwesome5 } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { useStockRepository } from "@/data/repositories/stockRepository";
import { Stock } from "@/types/stock";

export default function StocksScreen() {
  const { fetchStocks } = useStockRepository();
  const navigation = useNavigation();

  const [filterText, setFilterText] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [stocks, setStocks] = useState<Stock[]>([]);

  const filteredStocks = stocks.filter((stock: Stock) =>
    stock.title.toLowerCase().includes(filterText.toLowerCase())
  );

  const fetchStockData = async () => {
    setRefreshing(true);
    const stocks = await fetchStocks();
    setStocks(stocks);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchStockData();
    navigation.setOptions({
      headerTitle: "Stocks",
      headerSearchBarOptions: {
        placeholder: "Search stocks",
        onChangeText: (event: {
          nativeEvent: { text: React.SetStateAction<string> };
        }) => {
          setFilterText(event.nativeEvent.text);
        },
      },
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 5, marginTop: 6 }}
          onPress={() => router.push("/stocks/watchlist")}
        >
          <FontAwesome5 name="eye" size={20} color="#007AFF" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  return (
    <StockListing
      stocks={filteredStocks}
      refreshing={refreshing}
      onRefresh={fetchStockData}
    />
  );
}
