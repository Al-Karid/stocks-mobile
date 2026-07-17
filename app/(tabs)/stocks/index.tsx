import StockListing from "@/components/stocks/StockListing";
import { Feather } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStockRepository } from "@/data/repositories/stockRepository";
import { Stock } from "@/types/stock";

export default function StocksScreen() {
  const { fetchStocks } = useStockRepository();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

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
      />
      {/* Palmares FAB — positioned above the native tab bar */}
      <View
        style={{
          position: "absolute",
          right: 0,
          bottom: insets.bottom + 90,
          zIndex: 9999,
          elevation: 9999,
        }}
        pointerEvents="box-none"
      >
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/stocks/palmares")}
          className="bg-black w-14 h-14 rounded-full items-center justify-center mr-5"
          style={{
            elevation: 6,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.2,
            shadowRadius: 6,
          }}
        >
          <Feather name="award" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
