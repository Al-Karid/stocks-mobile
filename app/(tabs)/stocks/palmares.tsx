import StockCard from "@/components/stocks/StockCard";
import React, { useEffect } from "react";
import { FlatList, RefreshControl } from "react-native";
import { useStockRepository } from "@/data/repositories/stockRepository";
import { Stock } from "@/types/stock";

const PalmaresScreen = () => {
  const { fetchPalmares } = useStockRepository();
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

  // De-duplicate based on 'id' property
  const uniquePalmaresData = palmaresData.filter(
    (value, index, self) =>
      index === self.findIndex((t) => t.id === value.id) // Keep only the first occurrence of each 'id'
  );

  return (
    <FlatList
      data={uniquePalmaresData} // Use the de-duplicated data
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
