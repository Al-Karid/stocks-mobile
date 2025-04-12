// components/HoldingListing.tsx
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Holding } from "@/types/portfolio";
import HoldingCard from "./HoldingCard";

interface Props {
  holdings: Holding[];
}

export default function HoldingListing({ holdings }: Props) {
  return (
    <FlatList
      data={holdings}
      keyExtractor={(item) => item.symbol}
      renderItem={({ item }) => <HoldingCard holding={item} />}
      contentContainerStyle={styles.container}
      contentInsetAdjustmentBehavior="automatic"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});