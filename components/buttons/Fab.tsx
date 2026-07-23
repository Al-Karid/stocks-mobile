import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

interface FabProps {
  icon?: keyof typeof Feather.glyphMap;
  onPress: () => void;
  disabled?: boolean;
  color?: string;
  disabledColor?: string;
}

const Fab: React.FC<FabProps> = ({
  icon = "plus",
  onPress,
  disabled = false,
  color = "black",
  disabledColor = "#ccc",
}) => {
  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <Pressable
        disabled={disabled}
        onPress={onPress}
        style={[
          styles.fab,
          { backgroundColor: disabled ? disabledColor : color },
        ]}
      >
        <Feather
          name={icon}
          size={24}
          color={disabled ? "black" : "white"}
        />
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  fab: {
    marginBottom: 16,
    marginRight: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
  },
});

export default Fab;