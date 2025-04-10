import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";
import { ArrowUpRight, ArrowDownRight, ArrowRight } from "lucide-react-native";
import { router } from "expo-router";

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
  const [modalVisible, setModalVisible] = useState(false);
  const isPositive = percentageChange > 0;
  const isNegative = percentageChange < 0;
  const isZero = percentageChange === 0;

  // console.log("isInWatchlist", isInWatchlist);
  
  return (
    <>
      <TouchableWithoutFeedback
        onPress={() =>
          router.push({
            pathname: "/details",
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
        <View style={styles.card}>
          <View style={styles.infoContainer}>
            <Text style={styles.symbol}>{symbol.trim()}</Text>
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.label}>
              C: <Text style={styles.value}>{currentPrice}</Text> {"  "}
              V: <Text style={styles.value}>{previousClosePrice}</Text>
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
              <ArrowUpRight color="white" size={20} />
            ) : isNegative ? (
              <ArrowDownRight color="white" size={20} />
            ) : (
              <ArrowRight color="white" size={20} />
            )}
            <Text style={styles.percentageText}>
              {isZero ? "0,00%" : percentageChange.toFixed(2) + "%"}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>

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
            <Text style={styles.modalText}>Nom complet : {name}</Text>
            <Text style={styles.modalText}>Prix actuel : {currentPrice}</Text>
            <Text style={styles.modalText}>
              Clôture précédente : {previousClosePrice}
            </Text>
            <Text style={styles.modalText}>
              Variation : {percentageChange.toFixed(2)}%
            </Text>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginVertical: 5,
    borderRadius: 12,
    padding: 20,
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
  value: {
    color: "#333",
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