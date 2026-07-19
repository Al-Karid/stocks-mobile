// components/HoldingListing.tsx
import React from "react";
import { FlatList, View, Text } from "react-native";
import { Holding, HoldingTargetRequest } from "@/types/portfolio";
import HoldingCard from "./HoldingCard";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";

interface Props {
  holdings: Holding[];
  onHoldingLongPress: (symbol: string) => void;
  onSaveTarget: (request: HoldingTargetRequest) => void;
}

export default function HoldingListing({ holdings, onHoldingLongPress }: Props) {

  const { t } = useTranslation();

  const handleTargetPress = (holding: Holding) => {
    router.push({
      pathname: "/portfolio/target",
      params: {
        portfolioId: holding.portfolioId.toString(),
        symbol: holding.symbol,
        name: holding.name,
        currentPrice: (holding.currentPrice ?? 0).toString(),
        targetPrice: holding.targetPrice != null ? holding.targetPrice.toString() : "",
        targetDate: holding.targetDate ?? "",
      },
    });
  };

  return (
    <FlatList
      data={holdings}
      keyExtractor={(item) => item.symbol}
      renderItem={({ item }) => (
        <HoldingCard
          holding={item}
          onLongPress={() => onHoldingLongPress(item.symbol)}
          onTargetPress={() => handleTargetPress(item)}
        />
      )}
      contentContainerStyle={{ padding: 16 }}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={() => (
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <Text style={{ fontStyle: "italic", color: "#888", textAlign: "center" }}>
            {t('your-transactions-will-appear-here')}
          </Text>
        </View>
      )}
      ListHeaderComponent={() => (
        <View style={{ marginBottom: 8 }}>
          <Text style={{ fontSize: 12, fontWeight: "bold", color: "gray", marginBottom: 8, marginLeft: 3 }}>
            Actions
          </Text>
        </View>
      )}
    />
  );
}