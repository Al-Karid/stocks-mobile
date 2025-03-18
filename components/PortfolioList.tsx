import React from "react";
import { FlatList, StyleSheet } from "react-native";
import PortfolioItem from "@/components/portfolio/PortfolioItem";

const portfolios = [
  { id: 1, updatedAt: null, userId: 1, name: "NASDAQ", holdings: [] },
  { id: 2, updatedAt: null, userId: 1, name: "BRVM", holdings: [] },
];

export default function PortfolioList() {
  return (
    <FlatList
      data={portfolios}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <PortfolioItem id={item.id} name={item.name} />}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 1.5,
  }
});
