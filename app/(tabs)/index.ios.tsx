import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  SafeAreaView,
  StatusBar,
} from 'react-native';

const HEADER_HEIGHT = 300;

export default function StabilizedOverscrollScreen() {
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#3B42C4"
      />

      {/* Static background shown during top overscroll */}
      <View style={styles.topBackground} />

      {/* <SafeAreaView style={styles.safeArea}> */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          bounces
          overScrollMode="always"
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="never"
        >
          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.headerTopActions}>
              <View style={styles.gearIcon} />
              <View style={styles.dots} />
            </View>

            <View style={styles.qrCard}>
              <Text style={styles.qrText}>[ QR Code Canvas ]</Text>
            </View>
          </View>

          {/* BODY */}
          <View style={styles.whiteBody}>
            <Text style={styles.sectionTitle}>Activités récentes</Text>

            {Array.from({ length: 12 }).map((_, i) => (
              <View key={i} style={styles.mockRow}>
                <Text style={styles.mockText}>
                  Transfert vers carte prépayée
                </Text>
                <Text style={styles.mockAmount}>-2.000F</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      {/* </SafeAreaView> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  safeArea: {
    flex: 1,
  },

  topBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT + 100,
    backgroundColor: '#3B42C4',
  },

  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  contentContainer: {
    paddingBottom: 40,
    marginTop: 40
  },

  header: {
    height: HEADER_HEIGHT,
    backgroundColor: '#3B42C4',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },

  headerTopActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
  },

  gearIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },

  dots: {
    width: 80,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },

  qrCard: {
    flex: 1,
    marginTop: 20,
    borderRadius: 20,
    backgroundColor: '#61A3EF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  qrText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },

  whiteBody: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,

    // overlap the header
    marginTop: -32,

    paddingTop: 32,
    paddingHorizontal: 20,
    paddingBottom: 40,

    // keeps rounded corners visible
    minHeight: 600,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#1A1A1A',
  },

  mockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ECECEC',
  },

  mockText: {
    fontSize: 14,
    color: '#2C3E50',
  },

  mockAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2980B9',
  },
});