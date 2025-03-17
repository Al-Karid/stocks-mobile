import { View, StyleSheet, Text } from "react-native";

interface PortfolioHoldingProps {
  item: Holding;
}

export default function PortfolioHolding({ item }: PortfolioHoldingProps) {
  return (
    <View style={styles.holdingCard}>
      <Text style={styles.holdingTitle}>{item.symbol}</Text>
      <Text style={styles.holdingText}>Quantity: {item.quantity}</Text>
      <Text style={styles.holdingText}>
        Buy Price: {item.averagePurchasePrice} FCFA
      </Text>
      <Text style={styles.holdingText}>
        Current Price: {item.currentPrice} FCFA
      </Text>
      <Text
        style={[
          styles.performance,
          { color: item.performence >= 0 ? "green" : "red" },
        ]}
      >
        Performance: {item.performence.toFixed(2)}%
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  holdingCard: {
    backgroundColor: "#fff",
    padding: 20,
    margin: 2,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    overflow: "hidden",
  },
  holdingTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  holdingText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 2,
  },
  performance: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
  },
});
