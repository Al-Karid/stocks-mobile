import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";

// Define the types for the navigation parameters (route params)
type RootStackParamList = {
  PortfolioList: undefined;
  PortfolioDetail: { id: number };
};

// Define the portfolio structure (you can adjust this to fit your actual data)
interface Portfolio {
  id: number;
  updatedAt: string | null;
  userId: number;
  name: string;
  holdings: any[]; // You can replace 'any' with a more specific type based on your data structure
}

// Example static data for portfolios (replace with actual data fetching logic)
const portfolios: Portfolio[] = [
  { id: 1, updatedAt: null, userId: 1, name: "NASDAQ", holdings: [] },
  { id: 2, updatedAt: null, userId: 1, name: "BRVM", holdings: [] },
];

export default function PortfolioDetail() {
  // Get the route parameters from the navigation
  const route = useRoute<RouteProp<RootStackParamList, 'PortfolioDetail'>>();
  const { id } = route.params;

  // Find the portfolio by id
  const portfolio = portfolios.find((portfolio) => portfolio.id === id);

  return (
    <View style={styles.container}>
      {portfolio ? (
        <>
          <Text style={styles.title}>{portfolio.name}</Text>
          <Text style={styles.details}>ID: {portfolio.id}</Text>
          <Text style={styles.details}>Holdings: {portfolio.holdings.length}</Text>
        </>
      ) : (
        <Text>Portfolio not found!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
  },
  details: {
    fontSize: 18,
    marginVertical: 5,
  },
});