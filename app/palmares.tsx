import StockCard from "@/components/stocks/StockCard";
import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { getPalmares } from "@/data/stockDataService";
import UpdatedAt from "@/components/UpdatedAt";
import { Stock } from "@/types/stock";

const PalmaresScreen = () => {
  
  const [palmaresData, setPalmaresData] = React.useState<Stock[]>([]);
  const [updatedAt, setUpdatedAt] = React.useState<string>("");

  const fetchPalmaresData = async () => {
    const data = await getPalmares();
    setPalmaresData(data.sort((a, b) => b.percentageChange - a.percentageChange));
    setUpdatedAt(data[0].updatedAt);
  };
  
  React.useEffect(() => {
    fetchPalmaresData();
  }, []);
  
  return (
    <View style={styles.listContainer}>
      <FlatList
        data={palmaresData}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        // refreshControl={
        //   <RefreshControl refreshing={refreshing} onRefresh={fetchStockData} colors={["#007bff"]} />
        // }
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
      <UpdatedAt updatedAt={updatedAt} />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingBottom: 20,
    backgroundColor: "white",
  },
  container: {
    padding: 4,
  },
  filterInput: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
    marginHorizontal: 4,
    backgroundColor: "white",
  },
  filterInputFocused: {
    borderColor: "#007bff",
    borderWidth: 1,
    shadowColor: "#007bff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 1.5,
    elevation: 5, // Glow effect on Android
  },
});

export default PalmaresScreen;
