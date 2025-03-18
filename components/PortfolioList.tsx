import React from "react";
import { FlatList, StyleSheet } from "react-native";
import PortfolioItem from "@/components/portfolio/PortfolioItem";

interface PortfolioListProps {
  portfolios: Portfolio[];
}

export default function PortfolioList({ portfolios} : PortfolioListProps) {
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
