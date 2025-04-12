// PortfolioListing.tsx
import React, { useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import Dialog from "react-native-dialog";
import PortfolioCard from "@/components/portfolio/PortfolioCard";
import { handleCloseDialog } from "@/utils/dialogUtils";
import { usePortfolioStore } from "@/stores/portfolioStore";

interface Portfolio {
  id: number;
  name: string;
  performance?: number;
}

interface PortfolioListProps {
  portfolios: Portfolio[];
}

export default function PortfolioListing({ portfolios }: PortfolioListProps) {
  const { deletePortfolio, renamePortfolio } = usePortfolioStore();

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

  const handleDelete = (id: number) => {
    deletePortfolio(id);
  };

  return (
    <>
      <FlatList
        data={portfolios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PortfolioCard
            id={item.id}
            name={item.name}
            performance={item.performance}
            onRename={() => showRenameDialog(item.id, item.name)}
            onDelete={() => handleDelete(item.id)}
          />
        )}
        contentContainerStyle={styles.container}
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
    padding: 1.5,
  },
});
