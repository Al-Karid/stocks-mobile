import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ArrowUpRight, ArrowDownRight, ArrowRight } from "lucide-react-native";
import { useStockRepository } from "@/data/repositories/stockRepository";
import { useWatchlistStore } from "@/stores/watchlistStore";
import { useState, useEffect } from "react";
import { Stock } from "@/types/stock";
import { formatCurrency, formatPercentage } from "@/utils/numberUtils";
import { ScrollView } from "react-native-gesture-handler";

export default function StocksDetailsScreen() {
  
  const { symbol } = useLocalSearchParams();
  const { addStockToWatchlist, removeStockFromWatchlist } = useWatchlistStore();
  const { findStock } = useStockRepository();

  const [watchlisted, setWatchlisted] = useState(false);
  const [stock, setStock] = useState<Stock | null>(null);
  const [isDisabled, setIsDisabled] = useState(true);

  const fetchStockData = async () => {
    const data = await findStock(symbol as string);
    setStock(data);
    setWatchlisted(data?.isInWatchlist ?? false);
  };

  useEffect(() => {
    fetchStockData();
  }, []);

  const isPositive = (stock?.percentageChange ?? 0) > 0;
  const isNegative = (stock?.percentageChange ?? 0) < 0;
  const isZero = (stock?.percentageChange ?? 0) === 0;

  const addToWatchlist = (symbol: string | undefined) => {
    addStockToWatchlist(symbol ?? "");
    setWatchlisted(true);
  };

  const removeFromWatchlist = (symbol: string | undefined) => {
    removeStockFromWatchlist(symbol ?? "");
    setWatchlisted(false);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={[styles.card, styles.header]}>
        <Text style={styles.headerText}>{stock?.title}</Text>
      </View>

      {/* Price Card */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Current Price</Text>
          <Text style={styles.value}>
            {formatCurrency(stock?.currentPrice || 0)}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Previous Close</Text>
          <Text style={styles.value}>
            {formatCurrency(stock?.previousClosePrice || 0)}
          </Text>
        </View>

        <View style={styles.rowLast}>
          <Text style={styles.label}>Change</Text>
          <View
            style={[
              styles.percentageBox,
              isPositive && styles.positiveBox,
              isNegative && styles.negativeBox,
              isZero && styles.neutralBox, // Apply neutral style for 0%
            ]}
          >
            {isPositive ? (
              <ArrowUpRight size={16} color="white" />
            ) : isNegative ? (
              <ArrowDownRight size={16} color="white" />
            ) : (
              <ArrowRight size={16} color="white" /> // Neutral icon for 0%
            )}
            <Text style={styles.percentageText}>
              {isZero ? "0,00%" : formatPercentage(stock?.percentageChange!, 2)} (
              {formatCurrency(Number(stock?.currentPrice) - Number(stock?.previousClosePrice))})
            </Text>
          </View>
        </View>
      </View>

      {/* Extra Info Card */}
      <View style={[styles.card, { marginTop: 16 }]}>
        <View style={styles.row}>
          <Text style={styles.label}>Volume (titles)</Text>
          <Text style={styles.value}>
            {formatCurrency(stock?.volumeTitles || 0) || "N/A"}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Volume ()</Text>
          <Text style={styles.value}>
            {formatCurrency(stock?.volumeValues || 0) || "N/A"}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Opening Price</Text>
          <Text style={styles.value}>
            {formatCurrency(stock?.opening || 0) || "N/A"}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>High</Text>
          <Text style={styles.value}>
            {formatCurrency(stock?.high || 0) || "N/A"}
          </Text>
        </View>
        <View style={styles.rowLast}>
          <Text style={styles.label}>Low</Text>
          <Text style={styles.value}>
            {formatCurrency(stock?.low || 0) || "N/A"}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        {watchlisted ? (
          <TouchableOpacity
            style={styles.actionButtonRemove}
            onPress={() => removeFromWatchlist(stock?.symbol)}
          >
            <Text style={styles.actionButtonRemoveText}>
              Supprimer de la Watchlist
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => addToWatchlist(stock?.symbol)}
          >
            <Text style={styles.actionButtonText}>Ajouter à la Watchlist</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.actionButton, isDisabled && styles.actionButtonDisabled]}
          disabled={isDisabled}
        >
          <Text style={[styles.actionButtonText, isDisabled && styles.actionButtonTextDisabled]}>Ajouter au Portefeuille</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, isDisabled && styles.actionButtonDisabled]}
          disabled={isDisabled}
        >
          <Text style={[styles.actionButtonText, isDisabled && styles.actionButtonTextDisabled]}>Ajouter une Alerte</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 20
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#123458",
    textAlign: "center",
  },
  header: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 24
  },
  name: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  rowLast: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 0,
  },
  label: {
    fontSize: 16,
    color: "#777",
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
    color: "#222",
  },
  percentageBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  percentageText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
    marginLeft: 6,
  },
  positiveBox: {
    backgroundColor: "#4CAF50",
  },
  negativeBox: {
    backgroundColor: "#F44336",
  },
  neutralBox: {
    backgroundColor: "#8E8E8E",
  },
  neutralIcon: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 6,
  },
  actionsContainer: {
    marginTop: 24,
    gap: 12,
  },
  actionButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  actionButtonRemove: {
    backgroundColor: "#F7CFD8",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  actionButtonRemoveText: {
    color: "#102E50",
    fontSize: 16,
    fontWeight: "600",
  },
  actionButtonText: {
    color: "#12345",
    fontSize: 16,
    fontWeight: "600",
  },
  actionButtonDisabled: {
    backgroundColor: "#E0E0E0",
  },
  actionButtonTextDisabled: {
    color: "#A0A0A0",
  },
});
