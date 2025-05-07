import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useStockRepository } from "@/data/repositories/stockRepository";
import { useWatchlistStore } from "@/stores/watchlistStore";
import { useState, useEffect } from "react";
import { Stock } from "@/types/stock";
import { formatCurrency, formatPercentage } from "@/utils/numberUtils";
import { ScrollView } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import { globalCardStyles, globalTextStyles } from "@/styles/globalStyles";
import { useSettingsStore } from "@/stores/settingsStore";
import { useTranslation } from "react-i18next";

export default function StocksDetailsScreen() {

  const { t } = useTranslation();

  const { symbol } = useLocalSearchParams();
  const { addStockToWatchlist, removeStockFromWatchlist } = useWatchlistStore();
  const { findStock } = useStockRepository();
    const { userContraintCounts, increaseUserContraintCounts, decreaseUserContraintCounts } = useSettingsStore();

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
    decreaseUserContraintCounts("maxWatchlist");
  };

  const removeFromWatchlist = (symbol: string | undefined) => {
    removeStockFromWatchlist(symbol ?? "");
    setWatchlisted(false);
    increaseUserContraintCounts("maxWatchlist");
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={[globalCardStyles.card, styles.header]}>
        <Text style={styles.headerText}>{stock?.title}</Text>
      </View>

      {/* Price Card */}
      <View style={globalCardStyles.card}>
        <View style={globalTextStyles.labelValueDetailsContainer}>

          <View style={globalTextStyles.labelValueDetailsRow}>
            <Text style={globalTextStyles.label}>{t('current-price')}</Text>
            <Text style={globalTextStyles.value}>
              {formatCurrency(stock?.currentPrice || 0)}
            </Text>
          </View>

          <View style={globalTextStyles.labelValueDetailsRow}>
            <Text style={globalTextStyles.label}>{t('previous-close')}</Text>
            <Text style={globalTextStyles.value}>
              {formatCurrency(stock?.previousClosePrice || 0)}
            </Text>
          </View>

          <View style={[globalTextStyles.labelValueDetailsRow, styles.rowLast]}>
            <Text style={globalTextStyles.label}>{t('change-rate')}</Text>
            <View
              style={[
                styles.percentageBox,
                isPositive && styles.positiveBox,
                isNegative && styles.negativeBox,
                isZero && styles.neutralBox, // Apply neutral style for 0%
              ]}
            >
              {isPositive ? (
                <Feather name="arrow-up-right" size={20} color="white" />
              ) : isNegative ? (
                <Feather name="arrow-down-right" size={20} color="white" />
              ) : (
                <Feather name="minus" size={20} color="white" />
              )}
              <Text style={styles.percentageText}>
                {isZero ? "0,00%" : formatPercentage(stock?.percentageChange!, 2)} (
                {formatCurrency(Number(stock?.currentPrice) - Number(stock?.previousClosePrice))})
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Extra Info Card */}
      <View style={[globalCardStyles.card, { marginTop: 16 }]}>
        <View style={globalTextStyles.labelValueDetailsContainer}>
          <View style={globalTextStyles.labelValueDetailsRow}>
            <Text style={globalTextStyles.label}>{t('volume-titles')}</Text>
            <Text style={globalTextStyles.value}>
              {formatCurrency(stock?.volumeTitles || 0) || "N/A"}
            </Text>
          </View>
          <View style={globalTextStyles.labelValueDetailsRow}>
            <Text style={globalTextStyles.label}>{t('volume')}</Text>
            <Text style={globalTextStyles.value}>
              {formatCurrency(stock?.volumeValues || 0) || "N/A"}
            </Text>
          </View>
          <View style={globalTextStyles.labelValueDetailsRow}>
            <Text style={globalTextStyles.label}>{t('opening-price')}</Text>
            <Text style={globalTextStyles.value}>
              {formatCurrency(stock?.opening || 0) || "N/A"}
            </Text>
          </View>
          <View style={globalTextStyles.labelValueDetailsRow}>
            <Text style={globalTextStyles.label}>{t('high')}</Text>
            <Text style={globalTextStyles.value}>
              {formatCurrency(stock?.high || 0) || "N/A"}
            </Text>
          </View>
          <View style={globalTextStyles.labelValueDetailsRow}>
            <Text style={globalTextStyles.label}>{t('low')}</Text>
            <Text style={globalTextStyles.value}>
              {formatCurrency(stock?.low || 0) || "N/A"}
            </Text>
          </View>
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
              {t('remove-from-watchlist')}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            disabled={userContraintCounts.maxWatchlist <= 0}
            style={[styles.actionButton, (userContraintCounts.maxWatchlist <= 0) && styles.actionButtonDisabled]}
            onPress={() => addToWatchlist(stock?.symbol)}
          >
            <Text style={styles.actionButtonText}>{t('add-to-watchlist')}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.actionButton, isDisabled && styles.actionButtonDisabled]}
          disabled={isDisabled}
        >
          <Text style={[styles.actionButtonText, isDisabled && styles.actionButtonTextDisabled]}>{t('add-to-portfolio')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, isDisabled && styles.actionButtonDisabled]}
          disabled={isDisabled}
        >
          <Text style={[styles.actionButtonText, isDisabled && styles.actionButtonTextDisabled]}>{t('add-an-alert')}</Text>
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
    opacity: 0.6, // Add opacity for a more dynamic disabled effect
  },
  actionButtonTextDisabled: {
    color: "#A0A0A0",
  },
});
