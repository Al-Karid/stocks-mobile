import { useActionSheet } from "@expo/react-native-action-sheet";
import { Link } from "expo-router";
import { View, Pressable, StyleSheet, Text, TouchableOpacity } from "react-native";
import { HapticButton } from "../HapticButton";
import { HapticButtonLongPress } from "../HapticButtonLongPress";

type PortfolioProps = {
  id: number;
  name: string;
  performance?: number; // Optional performance percentage
};

const PortfolioCard: React.FC<PortfolioProps> = ({
  id,
  name,
  performance = 0,
}) => {

  const { showActionSheetWithOptions } = useActionSheet();
  const onPress = () => {
    const options = ['Delete', 'Save', 'Cancel'];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 2;

    showActionSheetWithOptions({
      options,
      cancelButtonIndex,
      destructiveButtonIndex
    }, (selectedIndex?: number) => {
      if (selectedIndex === undefined) return;

      switch (selectedIndex) {
        case 1:
          // Save
          break;

        case destructiveButtonIndex:
          // Delete
          break;

        case cancelButtonIndex:
          // Canceled
      }});
  }

  return (
    <HapticButtonLongPress style={styles.card} onLongPress={onPress}>
        <View style={styles.container}>
        <Text style={styles.title}>{name}</Text>
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
});

export default PortfolioCard;
