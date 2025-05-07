import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { formatCurrency, formatNumber } from "@/utils/numberUtils";
import { Feather } from "@expo/vector-icons";
import { globalCardStyles } from "@/styles/globalStyles";
import { useTranslation } from "react-i18next";

interface StockCardProps {
  name: string;
  symbol: string;
  currentPrice: number;
  previousClosePrice: number;
  percentageChange: number;
  volumeTitles: number;
  volumeValues: number;
  opening: number;
  high: number;
  low: number;
  isInWatchlist: boolean;
}

const StockCard: React.FC<StockCardProps> = ({
  name,
  symbol,
  currentPrice,
  previousClosePrice,
  percentageChange,
  volumeTitles,
  volumeValues,
  opening,
  high,
  low,
  isInWatchlist,
}) => {

  const { t } = useTranslation();
  
  const [modalVisible, setModalVisible] = useState(false);
  const isPositive = percentageChange > 0;
  const isNegative = percentageChange < 0;
  const isZero = percentageChange === 0;

  // console.log("isInWatchlist", isInWatchlist);

  return (
    <>
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/stocks/details",
            params: {
              symbol: symbol.trim(),
              name: name,
              currentPrice: currentPrice,
              previousClosePrice: previousClosePrice,
              percentageChange: percentageChange.toFixed(2),
              volumeTitles: volumeTitles,
              volumeValues: volumeValues,
              opening: opening,
              high: high,
              low: low,
              isInWatchlist: isInWatchlist ? "1" : "0",
            },
          })
        }
      >
        <View style={globalCardStyles.stockCard}>
          <View style={styles.infoContainer}>
            <Text style={styles.symbol}>{symbol.trim()}</Text>
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.label}>
              <Text style={styles.labelHeader}>Cours: </Text>
              <Text style={styles.value}>{formatCurrency(currentPrice)}</Text> {"  "}
              <Text style={styles.labelHeader}>Veille: </Text>
              <Text style={styles.value}>{formatCurrency(previousClosePrice)}</Text>
            </Text>
          </View>

          <View
            style={[
              styles.percentageContainer,
              isPositive && styles.positive,
              isNegative && styles.negative,
              isZero && styles.neutral,
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
              {isZero ? "0,00%" : percentageChange.toFixed(2) + "%"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{symbol}</Text>
            <Text style={styles.modalText}>{t('company')}: {name}</Text>
            <Text style={styles.modalText}>{t('current-price')}:  {currentPrice}</Text>
            <Text style={styles.modalText}>
              {t('previous-close-price')}: {previousClosePrice}
            </Text>
            <Text style={styles.modalText}>
              {t('change-rate')}: {percentageChange.toFixed(2)}%
            </Text>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    color: "#123458",
    fontSize: 10,
    marginBottom: 8,
  },
  symbol: {
    fontWeight: "bold",
    color: "#123458",
    fontSize: 16,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: "#666",
  },
  labelHeader: {
    fontStyle: "italic",
    color: "#123458",
    fontSize: 9,
  },
  value: {
    color: "#333",
    fontSize: 12,
  },
  percentageContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  percentageText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    marginLeft: 6,
  },
  positive: {
    backgroundColor: "#4CAF50",
  },
  negative: {
    backgroundColor: "#F44336",
  },
  neutral: {
    backgroundColor: "#8E8E8E", // A neutral gray color for no change
  },
  neutralIcon: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 280,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#123458",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 6,
    color: "#333",
  },
});

export default StockCard;
