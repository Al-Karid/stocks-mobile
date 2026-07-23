import StockListing from "@/components/stocks/StockListing";
import StockDetailsSheet from "@/components/stocks/StockDetailsSheet";
import { router, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useStockRepository } from "@/data/repositories/stockRepository";
import { Stock } from "@/types/stock";
import Fab from "@/components/buttons/Fab";

export default function StocksScreen() {
  const { fetchStocks } = useStockRepository();
  const navigation = useNavigation();

  const [filterText, setFilterText] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  const filteredStocks = stocks.filter((stock: Stock) =>
    stock.title.toLowerCase().includes(filterText.toLowerCase()),
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
      headerTitle: "BRVM",
      headerSearchBarOptions: {
        placeholder: "Search stocks",
        onChangeText: (event: {
          nativeEvent: { text: React.SetStateAction<string> };
        }) => {
          setFilterText(event.nativeEvent.text);
        },
      },
    });
  }, [navigation]);

  return (
    <View className="flex-1">
      <StockListing
        stocks={filteredStocks}
        refreshing={refreshing}
        onRefresh={fetchStockData}
        onSelectStock={setSelectedSymbol}
      />

      {/* Palmares FAB */}
      <Fab
        icon="award"
        onPress={() => router.push("/(tabs)/stocks/palmares")}
      />

      {/* Stock details bottom sheet */}
      <StockDetailsSheet
        symbol={selectedSymbol}
        isVisible={selectedSymbol !== null}
        onClose={() => setSelectedSymbol(null)}
      />
    </View>
  );
}