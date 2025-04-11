import { Link } from "expo-router";
import { View, Pressable, StyleSheet, Text } from "react-native";

type PortfolioProps = {
  id: number;
  name: string;
  performance?: number; // Optional performance percentage
};

const PortfolioCard: React.FC<PortfolioProps> = ({ id, name, performance = 0 }) => (
  <View style={styles.card}>
    <Pressable style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      <Text style={[
        styles.performance, 
        {color: performance >= 0 ? '#4CAF50' : '#F44336'}
      ]}>
        {performance >= 0 ? '+' : ''}{performance}%
      </Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff", 
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  performance: {
    fontSize: 16,
    fontWeight: "600",
  }
});

export default PortfolioCard; 