// components/HoldingListing.tsx
import React from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
import { Holding } from "@/types/portfolio";
import HoldingCard from "./HoldingCard";

interface Props {
  holdings: Holding[];
  onHoldingLongPress: (symbol: string) => void;
}

export default function HoldingListing({ holdings, onHoldingLongPress }: Props) {
  return (
    <FlatList
      data={holdings}
      keyExtractor={(item) => item.symbol}
      renderItem={({ item }) => <HoldingCard holding={item} onLongPress={() => onHoldingLongPress(item.symbol)} />}
      contentContainerStyle={styles.container}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={() => (
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <Text style={{ fontStyle: "italic", color: "#888", textAlign: "center" }}>
            Your transactions will appear here.
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});