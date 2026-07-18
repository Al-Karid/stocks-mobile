// components/HoldingCard.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Holding } from "@/types/portfolio";
import { FontAwesome, Feather } from "@expo/vector-icons";
import { formatCurrency, formatPercentage } from "@/utils/numberUtils";
import { globalCardStyles } from "@/styles/globalStyles";
import { useTranslation } from "react-i18next";
import { Colors } from "@/styles/colors";

interface Props {
  holding: Holding;
  onLongPress: () => void;
  onTargetPress: () => void;
}

export default function HoldingCard({ holding, onLongPress, onTargetPress }: Props) {

  const { t } = useTranslation();
  
  const {
    symbol,
    name,
    quantity,
    averagePrice,
    currentPrice,
    gainLoss,
    totalCost,
    targetPrice,
    targetDate,
  } = holding;

  const computedTotalCost = totalCost ?? quantity * averagePrice;
  const currentValue = quantity * currentPrice!;
  const isGain = gainLoss >= 0;
  const gainLossPercentage = ((currentPrice! - averagePrice) / averagePrice) * 100;

  const targetReturn = targetPrice != null && currentPrice! > 0
    ? ((targetPrice - currentPrice!) / currentPrice!) * 100
    : null;

  const daysToTarget = targetDate
    ? Math.ceil((new Date(targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const formatShortDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "2-digit" });
  };

  return (
    <TouchableOpacity onLongPress={() => onLongPress()} activeOpacity={0.4}>
      <View style={globalCardStyles.card}>
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.symbol}>{symbol.trim()}</Text>
          </View>
          <View style={styles.priceStatus}>
            <FontAwesome
              name={isGain ? "arrow-up" : "arrow-down"}
              size={18}
              color={isGain ? "#22c55e" : "#ef4444"}
            />
            <Text
              style={[
                styles.gainLossValue,
                { color: isGain ? "#22c55e" : "#ef4444" },
              ]}
            >
              {formatPercentage(gainLossPercentage, 2)} ({formatCurrency(gainLoss, 0)})
            </Text>
          </View>
        </View>

        {/* BODY */}
        <View style={styles.details}>
          <View style={styles.row}>
            <Text style={styles.label}>{t('quantity')}</Text>
            <Text style={styles.value}>{formatCurrency(quantity)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t('cmp')}</Text>
            <Text style={styles.value}>{formatCurrency(Number(averagePrice.toFixed(0)))}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t('current-price')}</Text>
            <Text style={styles.value}>{formatCurrency(Number(currentPrice!.toFixed(0)))}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t('total-cost')}</Text>
            <Text style={styles.value}>{formatCurrency(computedTotalCost.toFixed(0))}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t('current-value')}</Text>
            <Text style={styles.value}>{formatCurrency(currentValue.toFixed(0))}</Text>
          </View>
        </View>

        {/* TARGET SECTION */}
        <View style={styles.targetSection}>
          <TouchableOpacity style={styles.targetRow} onPress={onTargetPress}>
            <View style={styles.targetInfo}>
              <View style={styles.targetLabelRow}>
                <Feather name="target" size={14} color={Colors.headerBlue} />
                <Text style={styles.targetLabel}>{t("target")}</Text>
              </View>
              {targetPrice != null ? (
                <View style={styles.targetValues}>
                  <Text style={styles.targetPrice}>
                    {formatCurrency(targetPrice, 0)}
                  </Text>
                  {targetReturn !== null && (
                    <Text
                      style={[
                        styles.targetReturn,
                        { color: targetReturn >= 0 ? "#22c55e" : "#ef4444" },
                      ]}
                    >
                      {targetReturn >= 0 ? "+" : ""}
                      {formatPercentage(targetReturn, 2)}
                    </Text>
                  )}
                  {targetDate && (
                    <Text style={styles.targetDate}>
                      {t("by-date", { date: formatShortDate(targetDate) })}
                      {daysToTarget != null && daysToTarget > 0
                        ? ` (${t("in-days", { count: daysToTarget })})`
                        : ""}
                    </Text>
                  )}
                </View>
              ) : (
                <Text style={styles.noTarget}>{t("set-target")}</Text>
              )}
            </View>
            <Feather name="chevron-right" size={18} color="#ccc" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 20,
    marginBottom: 10
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  symbol: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#123456",
  },
  name: {
    color: "#6b7280",
    fontSize: 10,
    fontStyle: "normal",
    marginTop: 0,
  },
  priceStatus: {
    alignItems: "flex-end",
  },
  gainLossValue: {
    marginTop: 4,
    fontWeight: "600",
  },
  details: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 10,
    gap: 6,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    color: "#374151",
    fontSize: 14,
  },
  value: {
    fontWeight: "600",
    color: "#123456",
  },
  targetSection: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 10,
    marginTop: 10,
  },
  targetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  targetInfo: {
    flex: 1,
  },
  targetLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  targetLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.headerBlue,
  },
  targetValues: {
    marginLeft: 20,
  },
  targetPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  targetReturn: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 2,
  },
  targetDate: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  noTarget: {
    fontSize: 13,
    color: "#aaa",
    fontStyle: "italic",
    marginLeft: 20,
  },
});
