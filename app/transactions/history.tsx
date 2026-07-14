import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text } from "react-native";
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
  const { portfolioId, symbol, title} = useLocalSearchParams();
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
      const transactions = await getTransactions(Number(portfolioId), symbol as string);
      setTransactions(transactions);
    };
    fetchTransactions();

    navigation.setOptions({
      headerTitle: title,
      headerRight: () => (
        <HeaderButton onPress={handleDeleteHolding}>
          <Feather name="trash-2" size={19} color="#FF3B30" />
        </HeaderButton>
      ),
    });

  }, [portfolioId]);

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {transactions.map((transaction) => (
        <TransactionCard
          key={transaction.id}
          transaction={transaction}
          symbol={symbol as string}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    // backgroundColor: "#f2f2f2",
  },
});

export default TransactionDetails;
