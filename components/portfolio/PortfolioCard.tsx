import React, { useEffect } from "react";
import { View, Text, Alert, TouchableOpacity, Platform, LayoutAnimation } from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { router } from "expo-router";
import { Portfolio } from "@/types/portfolio";
import { formatCurrency, formatPercentage, isPositiveNumber } from "@/utils/numberUtils";
import { useTranslation } from "react-i18next";
import { Feather } from "@expo/vector-icons";
import { provideHapticFeedback } from "@/utils/interactionUtils";
import { usePortfolioStore } from "@/stores/portfolioStore";

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

  const { holdings: storeHoldings, getHoldings } = usePortfolioStore();

  // Load holdings reactively when card mounts or focus returns
  useEffect(() => {
    getHoldings(id);
  }, [id]);

  const holdings = storeHoldings.length > 0 ? storeHoldings : portfolio.holdings;

  const isPositive = isPositiveNumber(totalGainLoss);

  const totalExpectedGain = holdings
    .filter((h) => h.targetPrice != null)
    .reduce((sum, h) => ((h.targetPrice! - h.averagePrice) * h.quantity) + sum, 0);
  const hasExpectedGain = holdings.some((h) => h.targetPrice != null);

  // Gauge: where does current performance sit relative to expected gain?
  const currentVal = Math.abs(totalGainLoss ?? 0);
  const targetVal = Math.abs(totalExpectedGain);
  const totalSpan = currentVal + targetVal;
  const currentSegment = totalSpan > 0 ? (currentVal / totalSpan) * 100 : 0;
  const targetSegment = totalSpan > 0 ? (targetVal / totalSpan) * 100 : 0;

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
            case 0: onRename(); break;
            case 1:
              if (portfolio.isDefault) {
                Alert.alert(t("default-portfolio"), t("this-portfolio-is-already-set-as-default"));
              } else { onMakeDefault(); }
              break;
            case destructiveButtonIndex:
              Alert.alert(t("delete-portfolio"), t("are-you-sure-you-want-to-delete-name", { name }), [
                { text: t("cancel"), style: "cancel" },
                { text: t("delete"), style: "destructive", onPress: onDelete },
              ]);
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
          } else { onMakeDefault(); }
        },
      },
      {
        text: t("delete"), style: "destructive",
        onPress: () => {
          Alert.alert(t("delete-portfolio"), t("are-you-sure-you-want-to-delete-name", { name }), [
            { text: t("cancel"), style: "cancel" },
            { text: t("delete"), style: "destructive", onPress: onDelete },
          ]);
        },
      },
      { text: t("cancel"), style: "cancel", isPreferred: true },
    ]);
  };

  return (
    <TouchableOpacity
      className="rounded-2xl p-6 mb-2 border border-gray-200 bg-white"
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
      {/* Header: name + badges */}
      <View className="flex-row items-center gap-2 mb-5">
        <Text className="text-[17px] font-extrabold text-[#171717] tracking-tight flex-1">
          {name.toUpperCase()}
        </Text>
        {portfolio.isDefault && (
          <View className="bg-black px-2.5 py-1 rounded-full">
            <Feather name="star" size={11} color="white" />
          </View>
        )}
        <View className="bg-gray-100 px-2.5 py-1 rounded-full">
          <Text className="text-[11px] font-bold text-[#404040]">
            {holdings?.length ?? 0}
          </Text>
        </View>
      </View>

      {/* Gauge bar: always visible */}
      <View>
        <View className="h-2 bg-gray-100 rounded-full w-full overflow-hidden flex-row mb-3">
          {currentSegment > 0 && (
            <View
              style={{
                width: `${currentSegment}%`,
                backgroundColor: isPositive ? "#22c55e" : "#ef4444",
                borderTopLeftRadius: 4,
                borderBottomLeftRadius: 4,
              }}
            />
          )}
          {targetSegment > 0 && (
            <View
              style={{
                width: `${targetSegment}%`,
                backgroundColor: "#d1d5db",
                borderTopRightRadius: 4,
                borderBottomRightRadius: 4,
              }}
            />
          )}
        </View>

        {/* Gauge labels: perf rate | current gain | target gain */}
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center gap-1">
            <Feather
              name={isPositive ? "trending-up" : "trending-down"}
              size={13}
              color={(totalGainLoss ?? 0) !== 0 ? (isPositive ? "#16a34a" : "#dc2626") : "#d1d5db"}
            />
            <Text
              className={`text-[13px] font-bold ${
                (totalGainLoss ?? 0) !== 0
                  ? isPositive ? "text-green-600" : "text-red-600"
                  : "text-gray-300"
              }`}
            >
              {(totalGainLoss ?? 0) !== 0
                ? formatPercentage(gainLossPercentage, 1)
                : "0%"}
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Feather
              name={isPositive ? "arrow-up" : "arrow-down"}
              size={12}
              color={(totalGainLoss ?? 0) !== 0 ? (isPositive ? "#16a34a" : "#dc2626") : "#d1d5db"}
            />
            <Text className="text-[13px] font-semibold text-[#171717]">
              {formatCurrency(Math.abs(totalGainLoss ?? 0), 0)}
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Feather name="target" size={13} color="#9ca3af" />
            <Text className="text-[13px] font-bold text-[#6b7280]">
              {hasExpectedGain
                ? formatCurrency(totalExpectedGain, 0)
                : "0 XOF"}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PortfolioCard;