import { formatLocalDate } from "@/utils/dateUtils";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Storage } from "expo-sqlite/kv-store";

interface UpdatedAtProps {
  updatedAt?: string;
}

const UpdatedAt: React.FC<UpdatedAtProps> = ({ updatedAt }) => {
  const [lastSync, setLastSync] = React.useState<string | null>(null);

  const getLastSync = async () => {
    const lastSync = await Storage.getItem("lastSync");
    setLastSync(lastSync);
  };

  React.useEffect(() => {
    getLastSync();
  }, []);
  return (
    <View>
      {updatedAt ? (
        <Text style={styles.dateText}>
          Données du {formatLocalDate(updatedAt)}
        </Text>
      ) : (
        <Text style={styles.dateText}>Données du {formatLocalDate(lastSync!)}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dateText: {
    fontSize: 12,
    color: "#12345678",
    marginBottom: 8,
    paddingHorizontal: 5,
    paddingTop: 10,
    paddingBottom: 2,
    textAlign: "center",
    borderTopColor: "#12345678",
  },
});

export default UpdatedAt;
