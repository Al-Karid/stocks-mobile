import React, { useEffect, useState } from "react";
import { View, Text, useWindowDimensions } from "react-native";
import Svg, { Polyline, Path, Defs, LinearGradient, Stop } from "react-native-svg";
import { BlurView } from "expo-blur";
import { Stock, StockHistoryEntry } from "@/types/stock";
import { useStockRepository } from "@/data/repositories/stockRepository";
import { formatCurrency, formatPercentage } from "@/utils/numberUtils";
import { Feather } from "@expo/vector-icons";

interface StockHeroCardProps {
  stock: Stock | null;
}

const StockHeroCard: React.FC<StockHeroCardProps> = ({ stock }) => {
  const { fetchStockHistory } = useStockRepository();
  const [history, setHistory] = useState<StockHistoryEntry[]>([]);

  useEffect(() => {
    if (!stock?.symbol) return;
    fetchStockHistory(stock.symbol).then(setHistory);
  }, [stock?.symbol]);

  const isPositive = (stock?.percentageChange ?? 0) > 0;
  const isNegative = (stock?.percentageChange ?? 0) < 0;

  const { width: screenWidth } = useWindowDimensions();
  const horizontalPadding = 20;
  const chartWidth = screenWidth - horizontalPadding * 2;
  const chartHeight = 100;

  const sorted = [...history].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const lineColor = isPositive ? "#16a34a" : isNegative ? "#dc2626" : "#6b7280";

  const startDate =
    sorted.length > 0
      ? new Date(sorted[0].date).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "short",
          year: "2-digit",
        })
      : "";
  const endDate =
    sorted.length > 0
      ? new Date(sorted[sorted.length - 1].date).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "short",
          year: "2-digit",
        })
      : "";

  const linePoints =
    sorted.length > 1
      ? sorted
          .map((entry, i) => {
            const x = (i / (sorted.length - 1)) * chartWidth;
            const min = Math.min(...sorted.map((e) => e.closing));
            const max = Math.max(...sorted.map((e) => e.closing));
            const range = max - min || 1;
            const y = chartHeight - ((entry.closing - min) / range) * chartHeight;
            return `${x},${y}`;
          })
          .join(" ")
      : "";

  const areaPath =
    sorted.length > 1
      ? `M ${linePoints} L ${chartWidth},${chartHeight} L 0,${chartHeight} Z`
      : "";

  return (
    <View className="rounded-3xl items-center border border-white bg-gray-200/30 backdrop-blur-sm overflow-hidden">
      {/* Chart layer with blur */}
      {linePoints && (
        <View
          className="absolute"
          style={{
            top: 0,
            bottom: 0,
            left: -horizontalPadding,
            right: -horizontalPadding,
          }}
        >
          <BlurView intensity={20} tint="light" style={{ flex: 1 }}>
            <Svg
              height="100%"
              width="100%"
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              preserveAspectRatio="none"
            >
              <Defs>
                <LinearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor={lineColor} stopOpacity={0.18} />
                  <Stop offset="1" stopColor={lineColor} stopOpacity={0} />
                </LinearGradient>
              </Defs>
              <Path d={areaPath} fill="url(#areaGrad)" />
              <Polyline
                points={linePoints}
                fill="none"
                stroke={lineColor}
                strokeWidth={1}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.35}
              />
            </Svg>
          </BlurView>

          {/* Date labels under the blurred chart */}
          {sorted.length > 0 && (
            <View className="flex-row justify-between px-5 absolute bottom-1 left-3 right-3">
              <Text className="text-[8px] text-gray-300">{startDate}</Text>
              <Text className="text-[8px] text-gray-300">{endDate}</Text>
            </View>
          )}
        </View>
      )}

      {/* Card content on top */}
      <View className="px-5 py-6 items-center w-full z-10">
        <Text className="text-xs font-semibold text-[#a3a3a3] uppercase tracking-widest mb-1">
          {stock?.symbol}
        </Text>
        <Text className="text-base font-bold text-[#171717] text-center mb-4">
          {stock?.title}
        </Text>

        <Text className="text-4xl font-extrabold text-[#171717] mb-2">
          {formatCurrency(stock?.currentPrice || 0)}
        </Text>

        <View
          className={`flex-row items-center px-3 py-1.5 rounded-full ${
            isPositive
              ? "bg-green-500"
              : isNegative
              ? "bg-red-500"
              : "bg-gray-400"
          }`}
        >
          <Feather
            name={
              isPositive
                ? "arrow-up-right"
                : isNegative
                ? "arrow-down-right"
                : "minus"
            }
            size={14}
            color="white"
          />
          <Text className="text-white text-sm font-bold ml-1">
            {formatPercentage(stock?.percentageChange ?? 0, 2)}
          </Text>
          <Text className="text-white/80 text-xs ml-1">
            ({formatCurrency((stock?.currentPrice ?? 0) - (stock?.previousClosePrice ?? 0))})
          </Text>
        </View>
      </View>
    </View>
  );
};

export default StockHeroCard;