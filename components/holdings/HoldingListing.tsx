// components/HoldingListing.tsx
import React from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
import { Holding } from "@/types/portfolio";
import HoldingCard from "./HoldingCard";
import { useTranslation } from "react-i18next";

interface Props {
  holdings: Holding[];
  portfolioName: string;
  onHoldingLongPress: (symbol: string) => void;
}

export default function HoldingListing({ holdings, portfolioName, onHoldingLongPress }: Props) {

  const { t } = useTranslation();
  
  return (
    <FlatList
      data={holdings}
      keyExtractor={(item) => item.symbol}
      renderItem={({ item }) => <HoldingCard holding={item} onLongPress={() => onHoldingLongPress(item.symbol)} />}
      contentContainerStyle={styles.container}
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
          <Text style={styles.portfolioName}>{portfolioName.toLocaleUpperCase()}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  portfolioName: {
    fontSize: 12,
    fontWeight: "bold",
    color: "gray",
    marginBottom: 8,
    marginLeft: 3,
  },
});