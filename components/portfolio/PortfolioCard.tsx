import { useActionSheet } from "@expo/react-native-action-sheet";
import React from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { HapticButtonLongPress } from "../buttons/HapticButtonLongPress";
import { router } from "expo-router";
import { Portfolio } from "@/types/portfolio";
import { formatPercentage, isPositiveNumber } from "@/utils/numberUtils";
import { useTranslation } from "react-i18next";

type PortfolioProps = {
  portfolio: Portfolio;
  onRename: () => void;
  onDelete: () => void;
  onMakeDefault: () => void;
};

const PortfolioCard: React.FC<PortfolioProps> = ({
  portfolio,
  onRename,
  onDelete,
  onMakeDefault,
}) => {

  const { t } = useTranslation();
  
  const { showActionSheetWithOptions } = useActionSheet();
  const { id, name, performance } = portfolio;
  const { gainLossPercentage, totalGainLoss } = performance || {};

  const isPositive = isPositiveNumber(totalGainLoss);

  const onPress = () => {
    const options = [t('details'), t('rename'), t('make-default'), t('delete'), t('cancel')];
    const destructiveButtonIndex = 3;
    const cancelButtonIndex = 4;

    showActionSheetWithOptions(
      {
        title: name.toLocaleUpperCase(),
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (selectedIndex?: number) => {
        if (selectedIndex === undefined) return;

        switch (selectedIndex) {
          case 1:
            onRename();
            break;
          case destructiveButtonIndex:
            Alert.alert(
              t('delete-portfolio'),
              t('are-you-sure-you-want-to-delete-name', { name }),
              [
                { text: t('cancel'), style: "cancel" },
                { text: t('delete'), style: "destructive", onPress: onDelete },
              ]
            );
            break;
          case 0:
            router.push({ pathname: "/portfolio/details", params: { portfolioId: id } });
            break;
          case 2:
            if (portfolio.isDefault) {
              Alert.alert(t('default-portfolio'), t('this-portfolio-is-already-set-as-default'));
            } else {
              onMakeDefault();
            }
            break;
        }
      }
    );
  };

  return (
    <HapticButtonLongPress
      style={styles.card}
      onPress={() => router.push({ pathname: "/portfolio/holdings", params: { portfolioId: id } })}
      onLongPress={onPress}
    >
      <View style={styles.container}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.title}>{name.toUpperCase()}</Text>
          <Text style={styles.defaultMark}>
            {portfolio.isDefault ? "★" : ""}
          </Text>
        </View>

        <Text
          style={[
            styles.performance,
            { color: isPositive ? "#4CAF50" : "#F44336" },
          ]}
        >
          {formatPercentage(gainLossPercentage, 2)}
        </Text>
      </View>

    </HapticButtonLongPress>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingVertical: 25,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 10
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#213555",
  },
  performance: {
    fontSize: 16,
    fontWeight: "600",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "#00000066",
    justifyContent: "center",
    alignItems: "center",
  },
  dialog: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 15,
  },
  cancelText: {
    fontSize: 16,
    color: "#888",
  },
  saveText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007bff",
  },
  defaultMark: {
    fontSize: 12,
    color: "#5E686D",
    marginLeft: 4,
  },
});

export default PortfolioCard;
