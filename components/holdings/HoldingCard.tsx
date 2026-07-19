// components/HoldingCard.tsx
import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Holding } from "@/types/portfolio";
import { Feather } from "@expo/vector-icons";
import { formatCurrency, formatPercentage } from "@/utils/numberUtils";
import { useTranslation } from "react-i18next";

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

  const targetReturn = targetPrice != null && averagePrice > 0
    ? ((targetPrice - averagePrice) / averagePrice) * 100
    : null;

  const daysToTarget = targetDate
    ? Math.ceil((new Date(targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const formatShortDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "2-digit" });
  };

  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const hasTarget = targetPrice != null;
  const expectedGain = hasTarget ? (targetPrice! - averagePrice) * quantity : null;
  const detailsOpacity = useRef(new Animated.Value(0)).current;
  const detailsHeight = useRef(new Animated.Value(0)).current;
  const trendOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (detailsExpanded) {
      Animated.parallel([
        Animated.timing(detailsOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.spring(detailsHeight, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: false,
        }),
        Animated.timing(trendOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(detailsOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(detailsHeight, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(trendOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [detailsExpanded]);

  const toggleDetails = () => setDetailsExpanded(prev => !prev);

  // Gauge calculation
  const cmpToCurrentAbs = Math.abs(currentPrice! - averagePrice);
  const currentToTargetAbs = hasTarget ? Math.abs(targetPrice! - currentPrice!) : 0;
  const totalSpan = cmpToCurrentAbs + currentToTargetAbs;
  const leftSegmentWidth = totalSpan > 0 ? (cmpToCurrentAbs / totalSpan) * 100 : 0;
  const rightSegmentWidth = totalSpan > 0 ? (currentToTargetAbs / totalSpan) * 100 : 0;
  const cmpToCurrentIsPositive = currentPrice! >= averagePrice;
  const currentToTargetIsPositive = hasTarget && targetPrice! >= currentPrice!;

  const gainColor = isGain ? "#22c55e" : "#ef4444";
  const gainLightBg = isGain ? "#f0fdf4" : "#fef2f2";
  const gainBadgeBg = isGain ? "#dcfce7" : "#fce4ec";
  const gainStrongColor = isGain ? "#16a34a" : "#dc2626";

  const targetTrackColor = currentToTargetIsPositive ? "#9ca3af" : "#d1d5db";
  const targetChipBg = currentToTargetIsPositive ? "#f3f4f6" : "#f9fafb";
  const targetChipColor = currentToTargetIsPositive ? "#6b7280" : "#9ca3af";
  const cmpTrackColor = cmpToCurrentIsPositive ? "#22c55e" : "#ef4444";
  const cmpChipBg = cmpToCurrentIsPositive ? "#dcfce7" : "#fce4ec";
  const cmpChipColor = cmpToCurrentIsPositive ? "#16a34a" : "#dc2626";

  return (
    <TouchableOpacity onLongPress={() => onLongPress()} activeOpacity={0.4} className="border border-gray-200 rounded-xl bg-white mb-2">
      {/* CARD */}
      <View className="rounded-xl p-5 mb-0">
        
        {/* HEADER — tap to expand/collapse */}
        <TouchableOpacity onPress={toggleDetails} activeOpacity={0.7}>
          <View className="flex-row justify-between items-center mb-3">
            {/* Left: name + symbol */}
            <View className="flex-1">
              <Text className="text-[10px] text-gray-500">{name}</Text>
              <Text className="text-lg font-bold text-[#123456]">{symbol.trim()}</Text>
            </View>

            {/* Right: gain/loss indicator — fades out when expanded */}
            <Animated.View className="items-end" style={{ opacity: trendOpacity }}>
              <View className="flex-row items-center gap-1">
                <Feather
                  name={isGain ? "trending-up" : "trending-down"}
                  size={20}
                  color={gainColor}
                />
              </View>
              <Text className="text-sm font-semibold mt-1" style={{ color: gainColor }}>
                {formatPercentage(gainLossPercentage, 2)} ({formatCurrency(gainLoss, 0)})
              </Text>
            </Animated.View>
          </View>
        </TouchableOpacity>

        {/* DETAILS SECTION — collapsible */}
        <Animated.View
          style={{
            opacity: detailsOpacity,
            maxHeight: detailsHeight.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 500],
            }),
            overflow: 'hidden',
          }}
        >
        <View className="border-t border-gray-200 pt-2.5">
          
          {/* Group 1: Position */}
          <View className="py-1.5 gap-1.5">
            <View className="flex-row justify-between items-center py-0.5">
              <View className="flex-row items-center gap-2">
                <Feather name="layers" size={14} color="#6b7280" />
                <Text className="text-[13px] text-gray-600">{t('quantity')}</Text>
              </View>
              <Text className="text-sm font-semibold text-gray-800">{formatCurrency(quantity)}</Text>
            </View>
            <View className="flex-row justify-between items-center py-0.5">
              <View className="flex-row items-center gap-2">
                <Feather name="dollar-sign" size={14} color="#6b7280" />
                <Text className="text-[13px] text-gray-600">{t('cmp')}</Text>
              </View>
              <Text className="text-sm font-semibold text-gray-800">
                {formatCurrency(Number(averagePrice.toFixed(0)))}
              </Text>
            </View>
          </View>

          {/* Divider */}
          <View className="h-px bg-gray-100 my-1" />

          {/* Group 2: Market */}
          <View className="py-1.5 gap-1.5">
            <View className="flex-row justify-between items-center py-0.5">
              <View className="flex-row items-center gap-2">
                <Feather name="trending-up" size={14} color="#6b7280" />
                <Text className="text-[13px] text-gray-600">{t('current-price')}</Text>
              </View>
              <Text className="text-[15px] font-semibold text-[#007AFF]">
                {formatCurrency(Number(currentPrice!.toFixed(0)))}
              </Text>
            </View>
            <View className="flex-row justify-between items-center py-0.5">
              <View className="flex-row items-center gap-2">
                <Feather name="briefcase" size={14} color="#6b7280" />
                <Text className="text-[13px] text-gray-600">{t('current-value')}</Text>
              </View>
              <Text className="text-[15px] font-extrabold text-gray-900">
                {formatCurrency(currentValue.toFixed(0))}
              </Text>
            </View>
          </View>

          {/* Divider */}
          <View className="h-px bg-gray-100 my-1" />

          {/* Group 3: Cost + Gain/Loss */}
          <View className="py-1.5 gap-1.5">
            <View className="flex-row justify-between items-center py-0.5">
              <View className="flex-row items-center gap-2">
                <Feather name="shopping-cart" size={14} color="#6b7280" />
                <Text className="text-[13px] text-gray-600">{t('total-cost')}</Text>
              </View>
              <Text className="text-sm font-semibold text-gray-800">
                {formatCurrency(computedTotalCost.toFixed(0))}
              </Text>
            </View>

            {/* Gain/Loss highlight row */}
            <View
              className="flex-row justify-between items-center py-2 px-2.5 rounded-lg mt-1"
              style={{ backgroundColor: gainLightBg }}
            >
              <View className="flex-row items-center gap-2">
                <Feather
                  name={isGain ? "arrow-up-right" : "arrow-down-right"}
                  size={14}
                  color={gainStrongColor}
                />
                <Text className="text-[13px] font-semibold" style={{ color: gainStrongColor }}>
                  {isGain ? t('increase') : t('loss')}
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Text className="text-sm font-bold" style={{ color: gainStrongColor }}>
                  {isGain ? "+" : ""}{formatCurrency(gainLoss, 0)}
                </Text>
                <View className="px-2 py-0.5 rounded-full" style={{ backgroundColor: gainBadgeBg }}>
                  <Text className="text-[11px] font-bold" style={{ color: gainStrongColor }}>
                    {formatPercentage(gainLossPercentage, 1)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        </Animated.View>

        {/* TARGET SECTION */}
        <TouchableOpacity
          className="border-t border-gray-200 mt-3 pt-3 px-1"
          onPress={onTargetPress}
          activeOpacity={0.7}
        >
          {/* Header row */}
          <View className="flex-row justify-between items-center mb-2.5">
            {hasTarget && (
            <View className="flex-row items-center gap-1.5">
              <Feather name="target" size={13} color="#6b7280" />
              <Text className="text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                {t("target")}
              </Text>
            </View>
            )}
          </View>

          {hasTarget ? (
            <>
              {/* Price bar: CMP → Current → Target */}
              <View className="flex-row items-start gap-1">
                {/* CMP label */}
                <View className="items-center min-w-[68px]">
                  <Text className="text-[13px] font-bold text-gray-700">
                    {formatCurrency(averagePrice, 0)}
                  </Text>
                  <Text className="text-[9px] uppercase text-gray-400 mt-0.5 tracking-wider">{t('cmp')}</Text>
                </View>

                {/* Track */}
                <View className="flex-1 items-center pt-1.5 gap-1">
                  <View className="h-1.5 bg-gray-200 rounded-full w-full overflow-hidden flex-row">
                    {leftSegmentWidth > 0 && (
                      <View
                        style={{
                          width: `${leftSegmentWidth}%`,
                          backgroundColor: cmpTrackColor,
                          borderTopLeftRadius: 3,
                          borderBottomLeftRadius: 3,
                        }}
                      />
                    )}
                    {rightSegmentWidth > 0 && (
                      <View
                        style={{
                          width: `${rightSegmentWidth}%`,
                          backgroundColor: targetTrackColor,
                          borderTopRightRadius: 3,
                          borderBottomRightRadius: 3,
                        }}
                      />
                    )}
                  </View>

                  {/* Percentage chips */}
                  <View className="flex-row justify-center gap-1.5 flex-wrap">
                    <View
                      className="flex-row items-center gap-0.5 px-1.5 py-0.5 rounded-full"
                      style={{ backgroundColor: cmpChipBg }}
                    >
                      <Feather
                        name={cmpToCurrentIsPositive ? "trending-up" : "trending-down"}
                        size={10}
                        color={cmpChipColor}
                      />
                      <Text className="text-[10px] font-bold" style={{ color: cmpChipColor }}>
                        {formatPercentage(gainLossPercentage, 1)}
                      </Text>
                    </View>

                    <View
                      className="flex-row items-center gap-0.5 px-1.5 py-0.5 rounded-full"
                      style={{ backgroundColor: targetChipBg }}
                    >
                      <Feather
                        name={currentToTargetIsPositive ? "trending-up" : "trending-down"}
                        size={10}
                        color={targetChipColor}
                      />
                      <Text className="text-[10px] font-bold" style={{ color: targetChipColor }}>
                        {formatPercentage(targetReturn!, 1)}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Target label */}
                <View className="items-center min-w-[68px]">
                  <Text className="text-[13px] font-bold text-gray-700">
                    {formatCurrency(targetPrice!, 0)}
                  </Text>
                  <Text className="text-[9px] uppercase text-gray-400 mt-0.5 tracking-wider">Target</Text>
                </View>
              </View>

              {/* Expected gain */}
              {expectedGain != null && (
                <View className="flex-row justify-between items-center mt-3 pt-2 border-t border-gray-100">
                  <View className="flex-row items-center gap-1.5">
                    <Feather name="target" size={13} color="#6b7280" />
                    <Text className="text-[12px] text-gray-500">{t("expected-gain")}</Text>
                  </View>
                  <Text className="text-sm font-extrabold text-[#6b7280]">
                    {formatCurrency(expectedGain, 0)}
                  </Text>
                </View>
              )}

              {/* Date & countdown */}
              {targetDate && (
                <View className="flex-row items-center gap-1.5 mt-2.5 pl-0.5">
                  <Feather name="calendar" size={12} color="#9ca3af" />
                  <Text className="text-xs text-gray-500">
                    {t("by-date", { date: formatShortDate(targetDate) })}
                    {daysToTarget != null && daysToTarget > 0
                      ? ` · ${t("in-days", { count: daysToTarget })}`
                      : ""}
                  </Text>
                </View>
              )}
            </>
          ) : (
            <View className="flex-row items-center gap-2 py-1.5">
              <Feather name="plus-circle" size={16} color="#d1d5db" />
              <Text className="text-[13px] text-[#aaa] italic">{t("set-target")}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}