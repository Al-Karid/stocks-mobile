import { Link } from "expo-router";
import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const portfolios = [
  { id: 1, updatedAt: null, userId: 1, name: "NASDAQ", holdings: [] },
  { id: 2, updatedAt: null, userId: 1, name: "BRVM", holdings: [] },
];

type PortfolioProps = {
  id: number;
  name: string;
};

const PortfolioItem: React.FC<PortfolioProps> = ({ id, name }) => (
  <View style={styles.card}>
    <Link href={`/details/${id}`} asChild>
      <Text style={styles.title}>{name}</Text>
    </Link>
  </View>
);

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
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
