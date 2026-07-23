import React, { useEffect, useState } from "react";
import Dialog from "react-native-dialog";
import { Text, Pressable, Platform } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import PortfolioListing from "@/components/portfolio/PortfolioListing";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { handleCloseDialog } from "@/utils/dialogUtils";
import { provideHapticFeedback } from "@/utils/interactionUtils";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { useNavigation } from "expo-router";
import { Portfolio } from "@/types/portfolio";
import { StatusBar } from "expo-status-bar";
import { useSettingsStore } from "@/stores/settingsStore";
import Fab from "@/components/buttons/Fab";
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
    userContraintCounts,
    increaseUserContraintCounts,
    decreaseUserContraintCounts,
  } = useSettingsStore();

  const [portfolioName, setPortfolioName] = useState("");
  const [isAddVisible, setAddVisible] = useState(false);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);

  const handleOpenDialog = () => {
    provideHapticFeedback();
    setAddVisible(true);
  };

  const handleSavePortfolio = async (name: string) => {
    if (portfolioName.trim() === "") {
      alert(t("please-enter-a-portfolio-name"));
      return;
    }
    await addPortfolio(portfolioName);
    decreaseUserContraintCounts("maxPorfolio");
    setPortfolioName("");
    setAddVisible(false);
    await fetchPortfolios();
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  useEffect(() => {
    setPortfolios(portfolioStore);
  }, [portfolioStore]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        Platform.OS === "ios" ? (
          <Pressable
            style={{ marginRight: 5, marginTop: 6 }}
            onPress={handleOpenDialog}
          >
            <AntDesign name="folder" size={20} color="#007AFF" />
          </Pressable>
        ) : null,
    });
  }, [navigation]);

  return (
    <>
      <StatusBar style="dark" />
      <ActionSheetProvider>
        <>
          <PortfolioListing portfolios={portfolios} />

          <Dialog.Container visible={isAddVisible}>
            <Dialog.Title>
              <Text>{t("create-portfolio")}</Text>
            </Dialog.Title>
            <Dialog.Input
              placeholder={t("please-enter-a-portfolio-name")}
              value={portfolioName}
              onChangeText={setPortfolioName}
            />
            <Dialog.Button
              label={t("cancel")}
              onPress={() => handleCloseDialog(setAddVisible)}
            />
            <Dialog.Button
              label={t("create")}
              onPress={() => handleSavePortfolio(portfolioName)}
            />
          </Dialog.Container>
        </>
      </ActionSheetProvider>
      <Fab
        icon="plus"
        onPress={handleOpenDialog}
        disabled={userContraintCounts.maxPorfolio == 0}
      />
    </>
  );
}
