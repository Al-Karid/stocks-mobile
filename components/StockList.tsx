import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const stockData = [
  { id: '1', symbol: 'CI0000000659', name: 'TOTAL CI', currentPrice: 3700, previousClosePrice: 3730, percentageChange: -0.80 },
  { id: '2', symbol: 'CI0000000162', name: 'SOGB', currentPrice: 5280, previousClosePrice: 5295, percentageChange: -12.28 },
  { id: '3', symbol: 'CI0000000592', name: 'PALMCI', currentPrice: 6150, previousClosePrice: 6150, percentageChange: 0.0 },
  { id: '4', symbol: 'CI0000000196', name: 'SAPH CI', currentPrice: 4435, previousClosePrice: 4440, percentageChange: -0.11 },
];

const StockList = () => (
  <FlatList
    data={stockData}
    keyExtractor={(item) => item.id}
    contentContainerStyle={styles.container}
    renderItem={({ item }) => (
      <View style={styles.card}>
        <View style={styles.infoContainer}>
          <Text style={styles.symbol}>{item.name}</Text>
          <Text style={styles.price}>Current: {item.currentPrice} FCFA</Text>
        </View>
        <View style={[styles.percentageContainer, item.percentageChange >= 0 ? styles.positive : styles.negative]}>
          <Text style={styles.percentageText}>{item.percentageChange}%</Text>
        </View>
      </View>
    )}
  />
);

const styles = StyleSheet.create({
  container: {
    padding: 1.5,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2
  },
  infoContainer: {
    flex: 1,
    padding: 15,
  },
  symbol: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6.5,
  },
  price: {
    fontSize: 14,
    color: '#555',
  },
  percentageContainer: {
    width: 70, // Reduced width
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  percentageText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  positive: {
    backgroundColor: '#A0C878',
  },
  negative: {
    backgroundColor: '#F37199',
  },
});

export default StockList;
