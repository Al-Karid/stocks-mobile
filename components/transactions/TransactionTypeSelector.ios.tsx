import React from "react";
import { Pressable, Text, LayoutAnimation } from "react-native";
import { TransactionType } from "@/types/portfolio";
import { formatNumber } from "@/utils/numberUtils";
import { useTranslation } from "react-i18next";

interface TransactionTypeSelectorProps {
  type: TransactionType;
  onSelect: (type: TransactionType) => void;
  price?: number;
}

const TransactionTypeSelector: React.FC<TransactionTypeSelectorProps> = ({
  type,
  onSelect,
  price,
}) => {
  const { t } = useTranslation();

  return (
    <>
      {(["BUY", "SELL"] as TransactionType[]).map((value) => {
        const isSelected = type === value;
        const isBuy = value === "BUY";

        return (
          <Pressable
            key={value}
            className={`flex-1 aspect-square rounded-2xl items-center justify-center gap-2 overflow-hidden ${
              isSelected
                ? isBuy
                  ? "bg-blue-300/30 border-2 border-blue-300/30 backdrop-blur-sm"
                  : "bg-green-300/30 border-2 border-green-300/30 backdrop-blur-sm"
                : "border border-white/30 bg-gray-200/30 backdrop-blur-sm"
            }`}
            style={
              isSelected
                ? {
                    shadowColor: isBuy ? "#22c55e" : "#ef4444",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                  }
                : undefined
            }
            onPress={() => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              onSelect(value);
            }}
          >
            <Text
              className={`text-base font-extrabold ${
                isSelected ? "text-white" : "text-gray-500"
              }`}
            >
              {isBuy ? t("buy") : t("sell")}
            </Text>
            {isBuy && price != null && (
              <Text
              className={`text-xs ${
                isSelected ? "text-white/70" : "text-gray-400"
              }`}
              >
                {formatNumber(price)} FCFA
              </Text>
            )}
          </Pressable>
        );
      })}
    </>
  );
};

export default TransactionTypeSelector;