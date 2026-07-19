import React from "react";
import { View, Text, Alert, TouchableOpacity, Platform } from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { router } from "expo-router";
import { Portfolio } from "@/types/portfolio";
import { formatCurrency, formatPercentage, isPositiveNumber } from "@/utils/numberUtils";
import { useTranslation } from "react-i18next";
import { Feather } from "@expo/vector-icons";
import { provideHapticFeedback } from "@/utils/interactionUtils";

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
  const { id, name, holdings, performance } = portfolio;
  const { gainLossPercentage, totalGainLoss } = performance || {};

  const isPositive = isPositiveNumber(totalGainLoss);

  const onPress = () => {
    if (Platform.OS === "android") {
      const options = [t("rename"), t("make-default"), t("delete"), t("cancel")];
      const destructiveButtonIndex = 2;
      const cancelButtonIndex = 3;

      showActionSheetWithOptions(
        { title: name.toUpperCase(), options, cancelButtonIndex, destructiveButtonIndex, containerStyle: { paddingBottom: 60 } },
        (selectedIndex?: number) => {
          if (selectedIndex === undefined) return;
          switch (selectedIndex) {
            case 0:
              onRename();
              break;
            case 1:
              if (portfolio.isDefault) {
                Alert.alert(t("default-portfolio"), t("this-portfolio-is-already-set-as-default"));
              } else {
                onMakeDefault();
              }
              break;
            case destructiveButtonIndex:
              Alert.alert(
                t("delete-portfolio"),
                t("are-you-sure-you-want-to-delete-name", { name }),
                [
                  { text: t("cancel"), style: "cancel" },
                  { text: t("delete"), style: "destructive", onPress: onDelete },
                ]
              );
              break;
          }
        }
      );
      return;
    }

    Alert.alert(name.toUpperCase(), "", [
      { text: t("rename"), onPress: onRename },
      {
        text: t("make-default"),
        onPress: () => {
          if (portfolio.isDefault) {
            Alert.alert(t("default-portfolio"), t("this-portfolio-is-already-set-as-default"));
          } else {
            onMakeDefault();
          }
        },
      },
      {
        text: t("delete"),
        style: "destructive",
        onPress: () => {
          Alert.alert(
            t("delete-portfolio"),
            t("are-you-sure-you-want-to-delete-name", { name }),
            [
              { text: t("cancel"), style: "cancel" },
              { text: t("delete"), style: "destructive", onPress: onDelete },
            ]
          );
        },
      },
      { text: t("cancel"), style: "cancel", isPreferred: true },
    ]);
  };

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl p-4 mb-3 elevation-1"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      }}
      onPress={() =>
        router.push({ pathname: "/portfolio/holdings", params: { portfolioId: id } })
      }
      onLongPress={() => {
        provideHapticFeedback();
        onPress();
      }}
      activeOpacity={0.7}
    >
      {/* Top row: name badge + heart + trend icon */}
      <View className="flex-row items-center">
        <View className="bg-black/5 px-2 py-1 rounded-md">
          <Text className="text-[13px] font-bold text-gray-800 tracking-wider">
            {name.toUpperCase()}
          </Text>
        </View>
        {portfolio.isDefault && (
          <Feather name="heart" size={14} color="#000" className="ml-1.5" />
        )}
        <View className="flex-1" />
        <View className={`flex-row items-center gap-1 ${isPositive ? "" : ""}`}>
          <Feather
            name={isPositive ? "trending-up" : "trending-down"}
            size={16}
            color={isPositive ? "#16a34a" : "#dc2626"}
          />
        </View>
      </View>

      {/* Bottom row: holdings count + gain/loss + performance pill */}
      <View className="flex-row items-center mt-3">
        <Text className="text-xs text-gray-500">
          {holdings?.length ?? 0} {t("holdings").toLowerCase()}
        </Text>
        <View className="flex-1" />
        <Text className="text-sm font-semibold text-gray-700 mr-2">
          {formatCurrency(totalGainLoss ?? 0)}
        </Text>
        <View
          className={`px-2 py-1 rounded-md ${
            isPositive ? "bg-green-50" : "bg-red-50"
          }`}
        >
          <Text
            className={`text-xs font-semibold ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {formatPercentage(gainLossPercentage, 2)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PortfolioCard;