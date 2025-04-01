import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { stockData } from "@/data/stocks"; // Import des données
import { ArrowUpRight, ArrowDownRight } from "lucide-react-native"; // Icônes modernes

const StockList = () => (
  <FlatList
    data={stockData}
    keyExtractor={(item) => item.id.toString()}
    contentContainerStyle={styles.container}
    renderItem={({ item }) => (
      <View style={styles.card}>
        <View style={styles.infoContainer}>
          <Text style={styles.symbol}>{item.name}</Text>
          <Text style={styles.label}>
            C: <Text style={[styles.value]}>{item.currentPrice}</Text> {"  "}
            V: <Text style={styles.value}>{item.previousClosePrice}</Text>
          </Text>
        </View>

        {/* Indicateur de variation */}
        <View style={[styles.percentageContainer, item.percentageChange >= 0 ? styles.positive : styles.negative]}>
          {item.percentageChange >= 0 ? (
            <ArrowUpRight color="white" size={20} />
          ) : (
            <ArrowDownRight color="white" size={20} />
          )}
          <Text style={styles.percentageText}>{item.percentageChange}%</Text>
        </View>
      </View>
    )}
  />
);

const styles = StyleSheet.create({
  container: {
    padding: 4, // Augmente l'espacement global
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginVertical: 5, // Plus d'espace entre les cards
    borderRadius: 12, // Coins plus arrondis
    padding: 20, // Plus d'espace intérieur
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
  },
  symbol: {
    fontWeight: "bold",
    color: "#123458",
    fontSize: 18, // Augmenté pour plus de lisibilité
    marginBottom: 8, // Plus d'espace en bas
  },
  label: {
    fontSize: 16, // Texte plus grand
    color: "#666",
  },
  value: {
    // fontWeight: "bold",
    color: "#333",
  },
  current: {
    fontSize: 16,
    // fontWeight: "bold",
    color: "#F44336",
  
  },
  percentageContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12, // Plus large pour bien entourer le texte
    borderRadius: 10, // Coins légèrement arrondis
  },
  percentageText: {
    fontSize: 16, // Texte plus grand
    fontWeight: "bold",
    color: "white",
    marginLeft: 6, // Meilleur espacement avec l'icône
  },
  positive: {
    backgroundColor: "#4CAF50", // Vert pour positif
  },
  negative: {
    backgroundColor: "#F44336", // Rouge pour négatif
  },
  currentPositive: {
    color: "#4CAF50", // Vert pour positif
  },
  currentNegative: {
    color: "#F44336", // Rouge pour négatif
  },
});

export default StockList;