import StockListing from "@/components/stocks/StockListing";
import { router, useFocusEffect, useNavigation } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { TouchableOpacity, Text, View, SafeAreaView } from "react-native";
import { useStockStore } from "@/stores/stockStore";
import { Stock } from "@/types/stock";
import { StatusBar } from "expo-status-bar";

export default function StocksScreen() {
  const stockStore = useStockStore((state) => state.stocks);
  const navigation = useNavigation();

  const [filterText, setFilterText] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [stocks, setStocks] = useState<Stock[]>(stockStore);

  const filteredStocks = useMemo(() => {
    return stocks.filter((stock) =>
      stock.title.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [stockStore, filterText]);

  const fetchStockData = async () => {
    setRefreshing(true);
    // setStocks(stockStore); // You can fetch fresh data here if needed
    setRefreshing(false);
  };

  useEffect(() => {
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
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar style="dark" backgroundColor='white' />
      <StockListing
        stocks={filteredStocks}
        refreshing={refreshing}
        onRefresh={fetchStockData}
      />
    </SafeAreaView>
  );
}
