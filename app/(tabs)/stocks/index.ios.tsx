import React, { useEffect } from "react";
import { ScrollView, RefreshControl, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStockSync } from "@/data/configs/syncStocks";
import { useStockRepository } from "@/data/repositories/stockRepository";
import { Stock } from "@/types/stock";
import PalmaresSection from "@/components/stocks/PalmaresSection";
import StocksSection from "@/components/stocks/StocksSection";

export default function HomeScreen() {
  const [refreshing, setRefreshing] = React.useState(false);
  const [palmaresData, setPalmaresData] = React.useState<Stock[]>([]);
  const [stocksData, setStocksData] = React.useState<Stock[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { syncStockDataFromServer } = useStockSync();
  const { fetchPalmares, fetchStocks } = useStockRepository();

  const loadData = async () => {
    try {
      await syncStockDataFromServer();
      const [palmares, stocks] = await Promise.all([
        fetchPalmares(),
        fetchStocks(),
      ]);
      setPalmaresData(palmares);
      setStocksData(stocks);
    } catch (e) {
      console.error("❌ Failed to load data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await syncStockDataFromServer();
      const [palmares, stocks] = await Promise.all([
        fetchPalmares(),
        fetchStocks(),
      ]);
      setPalmaresData(palmares);
      setStocksData(stocks);
    } catch (e) {
      console.error("❌ Failed to refresh data", e);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#3D90D7"]}
        />
      }
    >
      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" className="mt-14" />
      ) : (
        <>
          <PalmaresSection stocks={palmaresData} />
          <StocksSection stocks={stocksData} />
        </>
      )}
    </ScrollView>
  );
}
