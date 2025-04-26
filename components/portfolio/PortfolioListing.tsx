// PortfolioListing.tsx
import React, { useState } from "react";
import { Alert, FlatList, StyleSheet, Text } from "react-native";
import Dialog from "react-native-dialog";
import PortfolioCard from "@/components/portfolio/PortfolioCard";
import { handleCloseDialog } from "@/utils/dialogUtils";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { Portfolio } from "@/types/portfolio";

interface PortfolioListProps {
  portfolios: Portfolio[];
}

export default function PortfolioListing({ portfolios }: PortfolioListProps) {
  const { deletePortfolio, renamePortfolio, makePortfolioAsDefault } = usePortfolioStore();

  const [isRenameVisible, setRenameVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [newName, setNewName] = useState("");

  const showRenameDialog = (id: number, currentName: string) => {
    setSelectedId(id);
    setNewName(currentName);
    setRenameVisible(true);
  };

  const handleRename = () => {
    renamePortfolio(selectedId!, newName);
    console.log(`Renamed portfolio ${selectedId} to: ${newName}`);
    handleCloseDialog(setRenameVisible);
    setSelectedId(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePortfolio(id);
    } catch (error: any) {
      Alert.alert("Error", error.message, [{ text: "OK" }])
    }
  };

  const handleMakeDefault = (id: number) => {
    makePortfolioAsDefault(id);
  }

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
            Create a portfolio to get started.
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

      <Dialog.Container visible={isRenameVisible}>
        <Dialog.Title>Rename Portfolio</Dialog.Title>
        <Dialog.Input
          placeholder="Enter new name"
          value={newName}
          onChangeText={setNewName}
        />
        <Dialog.Button
          label="Cancel"
          onPress={() => handleCloseDialog(setRenameVisible)}
        />
        <Dialog.Button label="Save" onPress={handleRename} />
      </Dialog.Container>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
