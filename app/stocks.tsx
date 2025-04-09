// stocks.tsx
import StockList from "@/components/stocks/StockList";
import React from "react";
import { View, Text } from "react-native";

export default function Stocks() {
  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "white" }}>
      {/* <Text style={{ fontSize: 32, fontWeight: "bold", marginBottom: 10 }}>Stocks</Text> */}
      <StockList />
    </View>
  );
}
