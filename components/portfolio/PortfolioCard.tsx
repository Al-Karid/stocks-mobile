import { useActionSheet } from "@expo/react-native-action-sheet";
import React from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { HapticButtonLongPress } from "../HapticButtonLongPress";

type PortfolioProps = {
  id: number;
  name: string;
  performance?: number;
  onRename: () => void;
  onDelete: () => void;
};

const PortfolioCard: React.FC<PortfolioProps> = ({
  id,
  name,
  performance = 0,
  onRename,
  onDelete,
}) => {
  const { showActionSheetWithOptions } = useActionSheet();

  const onPress = () => {
    const options = ["Rename", "Delete", "Cancel"];
    const destructiveButtonIndex = 1;
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        title: name.toLocaleUpperCase(),
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (selectedIndex?: number) => {
        if (selectedIndex === undefined) return;

        switch (selectedIndex) {
          case 0:
            onRename();
            break;
          case destructiveButtonIndex:
            Alert.alert(
              "Delete Portfolio",
              `Are you sure you want to delete "${name}" ?`,
              [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: onDelete },
              ]
            );
            break;
        }
      }
    );
  };

  return (
    <HapticButtonLongPress style={styles.card} onLongPress={onPress}>
      <View style={styles.container}>
        <Text style={styles.title}>{name.toUpperCase()}</Text>
        <Text
          style={[
            styles.performance,
            { color: performance >= 0 ? "#4CAF50" : "#F44336" },
          ]}
        >
          {performance >= 0 ? "+" : ""}
          {performance}%
        </Text>
      </View>
    </HapticButtonLongPress>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    paddingVertical: 25,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  performance: {
    fontSize: 16,
    fontWeight: "600",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "#00000066",
    justifyContent: "center",
    alignItems: "center",
  },
  dialog: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 15,
  },
  cancelText: {
    fontSize: 16,
    color: "#888",
  },
  saveText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007bff",
  },
});

export default PortfolioCard;
