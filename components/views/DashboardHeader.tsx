import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DashboardHeader = () => {
  const [isHidden, setIsHidden] = useState(false);

  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.greeting}>Hello, Al-karid</Text>
        <View style={styles.icons}>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color="white" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.portfolioSection}>
        <Text style={styles.portfolioTitle}>Total portfolio</Text>
        <View style={styles.portfolioAmountRow}>
          <Text style={styles.portfolioAmount}>{isHidden ? '**********' : '$16,458.50'}</Text>
          <TouchableOpacity onPress={() => setIsHidden(!isHidden)}>
            <Ionicons name={isHidden ? "eye-off-outline" : "eye-outline"} size={20} color="white" style={isHidden ? styles.eyeOff : styles.eye} />
          </TouchableOpacity>
        </View>
        <Text style={styles.portfolioChange}>▲ $1.20 (2.40%)</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#121212',
    padding: 20,
    paddingTop: 30,
    paddingBottom: 60,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 0,
  },
  portfolioSection: {
    marginTop: 20,
  },
  portfolioTitle: {
    color: 'gray',
    fontSize: 14,
  },
  portfolioAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  portfolioAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  portfolioChange: {
    color: '#00FF7F',
    marginTop: 5,
    fontSize: 16,
  },
  eye : {
    marginLeft: 8,
  },
  eyeOff : {
    marginLeft: 8,
    marginBottom: 12,
  },
});

export default DashboardHeader;