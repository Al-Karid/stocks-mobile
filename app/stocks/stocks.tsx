import StockListing from "@/components/stocks/StockListing";
import { useNavigation } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView } from "react-native";
import { useStockStore } from "@/stores/stockStore";
import { Stock } from "@/types/stock";
import { StatusBar } from "expo-status-bar";
import { useTranslation } from "react-i18next";

export default function StocksScreen() {

  const { t } = useTranslation();
  
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
      headerTitle: t('stocks'),
      headerSearchBarOptions: {
        placeholder: t('search-stocks'),
        onChangeText: (event: {
          nativeEvent: { text: React.SetStateAction<string> };
        }) => {
          setFilterText(event.nativeEvent.text);
        },
      }
    });
  }, [navigation]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar style="dark" />
      <StockListing
        stocks={filteredStocks}
        refreshing={refreshing}
        onRefresh={fetchStockData}
      />
    </SafeAreaView>
  );
}
