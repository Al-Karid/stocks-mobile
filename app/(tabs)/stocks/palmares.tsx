import React, { useEffect, useState } from "react";
import { View, FlatList, Platform, RefreshControl } from "react-native";
import StockCard from "@/components/stocks/StockCard";
import StockDetailsSheet from "@/components/stocks/StockDetailsSheet";
import { useStockRepository } from "@/data/repositories/stockRepository";
import { Stock } from "@/types/stock";

const PalmaresScreen = () => {
  const { fetchPalmares } = useStockRepository();
  const [palmaresData, setPalmaresData] = useState<Stock[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

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
    (value, index, self) => index === self.findIndex((t) => t.id === value.id),
  );

  return (
    <View className="flex-1">
      <FlatList
        data={uniquePalmaresData}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View className="h-2" />}
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
            onSelect={setSelectedSymbol}
          />
        )}
      />

      {/* Stock details bottom sheet */}
      <StockDetailsSheet
        symbol={selectedSymbol}
        isVisible={selectedSymbol !== null}
        onClose={() => setSelectedSymbol(null)}
      />
    </View>
  );
};

export default PalmaresScreen;
