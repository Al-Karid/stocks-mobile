import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmptyPortfolioCardProps {
  onPress?: () => void;
}

const EmptyPortfolioCard: React.FC<EmptyPortfolioCardProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Ionicons name="folder-open-outline" size={24} color="#8b5cf6" />
      <Text style={styles.title}>Your portfolio is empty</Text>
      <Text style={styles.text}>Add a holding to see it here.</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 220,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  title: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
  text: {
    marginTop: 4,
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default EmptyPortfolioCard;
