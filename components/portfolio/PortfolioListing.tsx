// PortfolioListing.tsx
import React, { useState } from "react";
import { Alert, FlatList, Platform, StyleSheet, Text } from "react-native";
import Dialog from "react-native-dialog";
import PortfolioCard from "@/components/portfolio/PortfolioCard";
import { handleCloseDialog } from "@/utils/dialogUtils";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { Portfolio } from "@/types/portfolio";
import { useSettingsStore } from "@/stores/settingsStore";
import { useTranslation } from "react-i18next";

interface PortfolioListProps {
  portfolios: Portfolio[];
}

export default function PortfolioListing({ portfolios }: PortfolioListProps) {

  const { t } = useTranslation();
  
  const { deletePortfolio, renamePortfolio, makePortfolioAsDefault } =
    usePortfolioStore();
  const {
    userContraintCounts,
    increaseUserContraintCounts,
    decreaseUserContraintCounts,
  } = useSettingsStore();

  const [isRenameVisible, setRenameVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [newName, setNewName] = useState("");

  const showRenameDialog = (id: number, currentName: string) => {
    if (Platform.OS === 'ios') {
      Alert.prompt(
        t('rename'),
        '',
        [
          { text: t('cancel'), style: 'cancel' },
          {
            text: t('save'),
            isPreferred: true,
            onPress: async (name?: string) => {
              if (name && name.trim()) {
                await renamePortfolio(id, name.trim());
              }
            },
          },
        ],
        'plain-text',
        currentName,
      );
      return;
    }
    setSelectedId(id);
    setNewName(currentName);
    setRenameVisible(true);
  };

  const handleRename = async () => {
    await renamePortfolio(selectedId!, newName);
    handleCloseDialog(setRenameVisible);
    setSelectedId(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePortfolio(id);
      increaseUserContraintCounts("maxPorfolio");
    } catch (error: any) {
      Alert.alert(t('error'), error.message, [{ text: t('okay') }]);
    }
  };

  const handleMakeDefault = (id: number) => {
    makePortfolioAsDefault(id);
  };

  return (
    <>
      <FlatList
        data={portfolios}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={() => (
          <Text
            style={{
              textAlign: "center",
              marginTop: 20,
              fontStyle: "italic",
              color: "#888",
            }}
          >
            {t('create-a-portfolio-to-get-started')}
          </Text>
        )}
        renderItem={({ item }) => (
          <PortfolioCard
            portfolio={item}
            onRename={() => showRenameDialog(item.id, item.name)}
            onDelete={() => handleDelete(item.id)}
            onMakeDefault={() => handleMakeDefault(item.id)}
          />
        )}
        contentContainerStyle={styles.container}
        contentInsetAdjustmentBehavior="automatic"
      />

      {Platform.OS === 'android' && (
        <Dialog.Container visible={isRenameVisible}>
          <Dialog.Title>{t('rename')}</Dialog.Title>
          <Dialog.Input
            placeholder={t('enter-new-name')}
            value={newName}
            onChangeText={setNewName}
          />
          <Dialog.Button
            label={t('cancel')}
            onPress={() => handleCloseDialog(setRenameVisible)}
          />
          <Dialog.Button label={t('save')} onPress={handleRename} />
        </Dialog.Container>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
