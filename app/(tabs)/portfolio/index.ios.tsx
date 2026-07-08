import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import { HeaderButton } from "@react-navigation/elements";
import { AntDesign } from "@expo/vector-icons";
import PortfolioListing from "@/components/portfolio/PortfolioListing";
import { provideHapticFeedback } from "@/utils/interactionUtils";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { useNavigation } from "expo-router";
import { Portfolio } from "@/types/portfolio";
import { StatusBar } from "expo-status-bar";
import { useSettingsStore } from "@/stores/settingsStore";
import { useTranslation } from "react-i18next";

export default function PortfolioScreen() {

  const { t } = useTranslation();
  const navigation = useNavigation();

  const {
    portfolios: portfolioStore,
    fetchPortfolios,
    addPortfolio,
  } = usePortfolioStore();
  const {
    decreaseUserContraintCounts,
  } = useSettingsStore();

  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);

  const handleOpenDialog = () => {
    provideHapticFeedback();
    Alert.prompt(
      t('create-portfolio'),
      '',
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('create'),
          isPreferred: true,
          onPress: async (name?: string) => {
            if (!name || name.trim() === "") return;
            await addPortfolio(name.trim());
            decreaseUserContraintCounts("maxPorfolio");
            await fetchPortfolios();
          },
        },
      ],
      'plain-text',
      '',
      'default'
    );
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  useEffect(() => {
    setPortfolios(portfolioStore);
  }, [portfolioStore]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButton onPress={handleOpenDialog}>
          <AntDesign name="plus" size={20} />
        </HeaderButton>
      ),
    });
  }, [navigation]);

  return (
    <>
      <StatusBar style="dark" backgroundColor="white" />
      <PortfolioListing portfolios={portfolios} />
    </>
  );
}
