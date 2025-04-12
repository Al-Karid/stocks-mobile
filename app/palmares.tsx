import StockCard from "@/components/stocks/StockCard";
import React, { useEffect } from "react";
import { FlatList, RefreshControl } from "react-native";
import { useStockDataService } from "@/data/useStockDataService";
import { Stock } from "@/types/stock";

const PalmaresScreen = () => {
  const { fetchPalmares } = useStockDataService();
  const [palmaresData, setPalmaresData] = React.useState<Stock[]>([]);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);

  const fetchPalmaresData = async () => {
    setRefreshing(true);
    const fetched = await fetchPalmares();
    setPalmaresData(fetched);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchPalmaresData();
  }, []);

  return (
    <FlatList
      data={palmaresData}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ padding: 16 }}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={fetchPalmaresData}
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
          isInWatchlist={false}
        />
      )}
    />
  );
};

export default PalmaresScreen;
