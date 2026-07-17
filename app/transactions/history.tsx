import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Platform, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeaderButton } from "@react-navigation/elements";
import { useLocalSearchParams, useNavigation, router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Transaction } from "@/types/portfolio";
import { usePortfolioStore } from "@/stores/portfolioStore";
import TransactionCard from "@/components/transactions/TransactionCard";
import { provideHapticFeedback } from "@/utils/interactionUtils";
import { useTranslation } from "react-i18next";

const TransactionDetails = () => {
  const { t } = useTranslation();
  const { portfolioId, symbol, title } = useLocalSearchParams();
  const { getTransactions, deleteHolding } = usePortfolioStore();

  const navigation = useNavigation();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleDeleteHolding = () => {
    provideHapticFeedback();
    Alert.alert(
      t("delete-holding"),
      t("are-you-sure-you-want-to-delete-holding", { symbol }),
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("delete"),
          style: "destructive",
          onPress: async () => {
            await deleteHolding(Number(portfolioId), symbol as string);
            router.back();
          },
        },
      ]
    );
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      const transactions = await getTransactions(
        Number(portfolioId),
        symbol as string,
      );
      setTransactions(transactions);
    };
    fetchTransactions();

    if (Platform.OS === "ios") {
      navigation.setOptions({
        headerTitle: title,
        headerRight: () => (
          <HeaderButton onPress={handleDeleteHolding}>
            <Feather name="trash-2" size={19} color="#FF3B30" />
          </HeaderButton>
        ),
      });
    } else {
      navigation.setOptions({ headerTitle: title });
    }
  }, [portfolioId]);

  return (
    <View className="flex-1">
      <ScrollView
        className={`flex-1 ${Platform.OS === "android" ? "bg-white" : ""}`}
        contentContainerStyle={{
          paddingVertical: 20,
          paddingHorizontal: 16,
          alignItems: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        {transactions.map((transaction) => (
          <TransactionCard
            key={transaction.id}
            transaction={transaction}
            symbol={symbol as string}
          />
        ))}
      </ScrollView>

      {/* Android FAB */}
      {Platform.OS === "android" && (
        <SafeAreaView edges={["bottom"]} className="absolute bottom-0 right-0">
          <TouchableOpacity
            onPress={handleDeleteHolding}
            className="bg-red-500 w-14 h-14 rounded-full items-center justify-center mb-4 mr-5"
            style={{
              elevation: 6,
              shadowColor: "#ef4444",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.35,
              shadowRadius: 6,
            }}
          >
            <Feather name="trash-2" size={22} color="#fff" />
          </TouchableOpacity>
        </SafeAreaView>
      )}
    </View>
  );
};

export default TransactionDetails;