import React from "react";
import { View, Text, Alert, TouchableOpacity, Platform, LayoutAnimation } from "react-native";
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

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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
      className="rounded-3xl p-5 mb-4 border border-white/30 bg-gray-200/30 backdrop-blur-sm"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 6,
      }}
      onPress={() => {
        provideHapticFeedback();
        router.push({ pathname: "/portfolio/holdings", params: { portfolioId: id } });
      }}
      onLongPress={() => {
        provideHapticFeedback();
        onPress();
      }}
      activeOpacity={0.85}
    >
      {/* Header row: name + star → performance pill */}
      <View className="flex-row items-center mb-4">
        <View className="flex-row items-center gap-2 flex-1">
          <Text className="text-[15px] font-extrabold text-[#171717] tracking-tight">
            {name.toUpperCase()}
          </Text>
          {portfolio.isDefault && (
            <View className="bg-black px-2 py-0.5 rounded-full">
              <Feather name="star" size={10} color="white" />
            </View>
          )}
        </View>
        <View
          className={`flex-row items-center gap-1 px-2 py-1 rounded-full ${
            isPositive
              ? "bg-green-300/30 border border-green-300/30"
              : "bg-red-300/30 border border-red-300/30"
          }`}
          style={{
            shadowColor: isPositive ? "#22c55e" : "#ef4444",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 6,
            elevation: 4,
          }}
        >
          <Feather
            name={isPositive ? "trending-up" : "trending-down"}
            size={12}
            color={isPositive ? "#16a34a" : "#dc2626"}
          />
          <Text
            className={`text-[11px] font-bold ${
              isPositive ? "text-green-700" : "text-red-700"
            }`}
          >
            {formatPercentage(gainLossPercentage, 2)}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View className="h-px bg-black/10 mb-4" />

      {/* Bottom row: holdings count + total gain/loss */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-1.5">
          <View className="w-8 h-8 rounded-full border border-white/30 bg-gray-200/30 backdrop-blur-sm items-center justify-center">
            <Text className="text-[11px] font-bold text-[#171717]">
              {holdings?.length ?? 0}
            </Text>
          </View>
          <Text className="text-[13px] font-medium text-[#404040]">
            {t("holdings").toLowerCase()}
          </Text>
        </View>

        <Text className="text-[15px] font-semibold text-[#171717]">
          {formatCurrency(totalGainLoss ?? 0)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default PortfolioCard;