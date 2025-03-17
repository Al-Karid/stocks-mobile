import { View, StyleSheet, Text } from "react-native";

interface PortfolioHoldingProps {
  item: Holding;
}

export default function PortfolioHolding({ item }: PortfolioHoldingProps) {
  return (
    <View style={styles.holdingCard}>
      {/* Left Section - Stock Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.holdingTitle}>{item.symbol}</Text>
        <Text style={styles.holdingText}>Quantity: {item.quantity}</Text>
        <Text style={styles.holdingText}>
          Buy Price: {item.averagePurchasePrice} FCFA
        </Text>
        <Text style={styles.holdingText}>
          Current Price: {item.currentPrice} FCFA
        </Text>
      </View>

      {/* Separator */}
      <View style={styles.separator} />

      {/* Right Section - Performance */}
      <View
        style={[
          styles.performanceContainer,
          item.performence >= 0 ? styles.positiveBackground : styles.negativeBackground,
        ]}
      >
        {/* <Text style={styles.arrow}>{item.performence >= 0 ? "▲" : "▼"}</Text> */}
        <Text style={styles.performanceText}>{item.performence.toFixed(2)}%</Text>
        <Text style={styles.currentPrice}>{item.currentPrice*100}</Text>
        <Text>FCFA</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  holdingCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    overflow: "hidden",
  },
  infoContainer: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  holdingTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#333",
    marginBottom: 8,
  },
  holdingText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 2,
  },
  separator: {
    width: 1.5,
    backgroundColor: "#E0E0E0",
    marginVertical: 10,
  },
  performanceContainer: {
    width: 130,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  positiveBackground: {
    backgroundColor: "#A0C878", // Light green background
  },
  negativeBackground: {
    backgroundColor: "#F37199", // Light red background
  },
  arrow: {
    fontSize: 20,
    fontWeight: "bold",
  },
  performanceText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "700",
    marginVertical: 4,
  },
  currentPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginTop: 4,
  },
});