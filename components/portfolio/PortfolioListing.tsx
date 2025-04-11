import React from "react";
import { FlatList, StyleSheet } from "react-native";
import PortfolioCard from "@/components/portfolio/PortfolioCard";

interface PortfolioListProps {
  portfolios: Portfolio[];
}

export default function PortfolioListing({ portfolios} : PortfolioListProps) {
  return (
    <FlatList
      data={portfolios}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <PortfolioCard id={item.id} name={item.name} />}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 1.5,
  }
});
