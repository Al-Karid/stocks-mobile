import { formatLocalDate } from "@/utils/dateUtils";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface UpdatedAtProps {
  updatedAt: string;
}

const UpdatedAt: React.FC<UpdatedAtProps> = ({ updatedAt }) => {
  return (
    <View>
      <Text style={styles.dateText}>Données du {formatLocalDate(updatedAt)}</Text>
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
