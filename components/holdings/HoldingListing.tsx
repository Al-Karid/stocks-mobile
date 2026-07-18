// components/HoldingListing.tsx
import React, { useState } from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
import { Holding, HoldingTargetRequest } from "@/types/portfolio";
import HoldingCard from "./HoldingCard";
import TargetPriceModal from "./TargetPriceModal";
import { useTranslation } from "react-i18next";

interface Props {
  holdings: Holding[];
  onHoldingLongPress: (symbol: string) => void;
  onSaveTarget: (request: HoldingTargetRequest) => void;
}

export default function HoldingListing({ holdings, onHoldingLongPress, onSaveTarget }: Props) {

  const { t } = useTranslation();
  const [targetModalVisible, setTargetModalVisible] = useState(false);
  const [selectedHolding, setSelectedHolding] = useState<Holding | null>(null);

  const handleTargetPress = (holding: Holding) => {
    setSelectedHolding(holding);
    setTargetModalVisible(true);
  };

  const handleTargetSave = (targetPrice: number | null, targetDate: string | null) => {
    if (selectedHolding) {
      onSaveTarget({
        portfolioId: selectedHolding.portfolioId,
        symbol: selectedHolding.symbol,
        targetPrice,
        targetDate,
      });
    }
    setTargetModalVisible(false);
    setSelectedHolding(null);
  };

  const handleTargetClear = () => {
    if (selectedHolding) {
      onSaveTarget({
        portfolioId: selectedHolding.portfolioId,
        symbol: selectedHolding.symbol,
        targetPrice: null,
        targetDate: null,
      });
    }
    setTargetModalVisible(false);
    setSelectedHolding(null);
  };

  return (
    <>
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
            <Text style={styles.portfolioName}>Actions</Text>
          </View>
        )}
      />

      <TargetPriceModal
        visible={targetModalVisible}
        holding={selectedHolding}
        onClose={() => {
          setTargetModalVisible(false);
          setSelectedHolding(null);
        }}
        onSave={handleTargetSave}
        onClear={handleTargetClear}
      />
    </>
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
