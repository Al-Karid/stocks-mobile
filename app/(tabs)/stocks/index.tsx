import StockListing from "@/components/stocks/StockListing";
import { router, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, Text, View } from "react-native";
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
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            style={{ marginHorizontal: 5 }}
            onPress={() => router.push("/stocks/palmares")}
          >
            <Text style={{ color: "#007AFF", fontSize: 14 }}>Palmarès</Text>
          </TouchableOpacity>
      
          <Text style={{ color: "#999", fontSize: 16 }}>|</Text>
      
          <TouchableOpacity
            style={{ marginHorizontal: 5 }}
            onPress={() => router.push("/stocks/watchlist")}
          >
            <Text style={{ color: "#007AFF", fontSize: 14 }}>Watchlist</Text>
          </TouchableOpacity>
        </View>
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
