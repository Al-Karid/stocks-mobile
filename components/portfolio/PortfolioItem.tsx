import { Link } from "expo-router";
import { View, Pressable, StyleSheet, Text } from "react-native";

type PortfolioProps = {
  id: number;
  name: string;
};

const PortfolioItem: React.FC<PortfolioProps> = ({ id, name }) => (
  <View style={styles.card}>
    <Link href={`/details/${id}`} asChild>
      <Pressable>
        <Text style={styles.title}>{name}</Text>
      </Pressable>
    </Link>
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
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PortfolioItem;