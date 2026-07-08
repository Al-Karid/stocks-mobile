import React from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity, Platform } from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { router } from "expo-router";
import { Portfolio } from "@/types/portfolio";
import { formatCurrency, formatPercentage, isPositiveNumber } from "@/utils/numberUtils";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { provideHapticFeedback } from "@/utils/interactionUtils";

type PortfolioProps = {
  portfolio: Portfolio;
  onRename: () => void;
  onDelete: () => void;
  onMakeDefault: () => void;
};

const PortfolioCard: React.FC<PortfolioProps> = ({
  portfolio,
  onRename,
  onDelete,
  onMakeDefault,
}) => {

  const { t } = useTranslation();

  const { showActionSheetWithOptions } = useActionSheet();
  const { id, name, holdings, performance } = portfolio;
  const { gainLossPercentage, totalGainLoss } = performance || {};

  const isPositive = isPositiveNumber(totalGainLoss);

  const onPress = () => {
    if (Platform.OS === 'android') {
      const options = [t('details'), t('rename'), t('make-default'), t('delete'), t('cancel')];
      const destructiveButtonIndex = 3;
      const cancelButtonIndex = 4;

      showActionSheetWithOptions(
        { title: name.toUpperCase(), options, cancelButtonIndex, destructiveButtonIndex },
        (selectedIndex?: number) => {
          if (selectedIndex === undefined) return;
          switch (selectedIndex) {
            case 0:
              router.push({ pathname: "/portfolio/details", params: { portfolioId: id } });
              break;
            case 1:
              onRename();
              break;
            case 2:
              if (portfolio.isDefault) {
                Alert.alert(t('default-portfolio'), t('this-portfolio-is-already-set-as-default'));
              } else {
                onMakeDefault();
              }
              break;
            case destructiveButtonIndex:
              Alert.alert(
                t('delete-portfolio'),
                t('are-you-sure-you-want-to-delete-name', { name }),
                [
                  { text: t('cancel'), style: 'cancel' },
                  { text: t('delete'), style: 'destructive', onPress: onDelete },
                ]
              );
              break;
          }
        }
      );
      return;
    }

    Alert.alert(
      name.toUpperCase(),
      '',
      [
        {
          text: t('details'),
          onPress: () => router.push({ pathname: "/portfolio/details", params: { portfolioId: id } }),
        },
        { text: t('rename'), onPress: onRename },
        {
          text: t('make-default'),
          onPress: () => {
            if (portfolio.isDefault) {
              Alert.alert(t('default-portfolio'), t('this-portfolio-is-already-set-as-default'));
            } else {
              onMakeDefault();
            }
          },
        },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              t('delete-portfolio'),
              t('are-you-sure-you-want-to-delete-name', { name }),
              [
                { text: t('cancel'), style: 'cancel' },
                { text: t('delete'), style: 'destructive', onPress: onDelete },
              ]
            );
          },
        },
        { text: t('cancel'), style: 'cancel', isPreferred: true },
      ]
    );
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push({ pathname: "/portfolio/holdings", params: { portfolioId: id } })}
      onLongPress={() => {
        provideHapticFeedback();
        onPress();
      }}
      activeOpacity={0.7}
    >
      <View style={styles.topRow}>
        <View style={styles.nameBadge}>
          <Text style={styles.nameText}>{name.toUpperCase()}</Text>
        </View>
        {portfolio.isDefault && (
          <Ionicons name="heart-circle" size={18} color="black" style={styles.starIcon} />
        )}
        <View style={styles.spacer} />
        <Ionicons
          name={isPositive ? 'trending-up' : 'trending-down'}
          size={18}
          color={isPositive ? '#16a34a' : '#dc2626'}
        />
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.holdingsCount}>
          {holdings?.length ?? 0} {t('holdings').toLowerCase()}
        </Text>
        <View style={styles.spacer} />
        <Text style={styles.gainLoss}>{formatCurrency(totalGainLoss ?? 0)}</Text>
        <View style={[styles.performanceBadge, isPositive ? styles.performanceBadgePositive : styles.performanceBadgeNegative]}>
          <Text style={[styles.performanceText, isPositive ? styles.performanceTextPositive : styles.performanceTextNegative]}>
            {formatPercentage(gainLossPercentage, 2)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    marginHorizontal: 0,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.06,
    // shadowRadius: 1,
    elevation: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameBadge: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  nameText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1f2937',
    letterSpacing: 0.5,
  },
  starIcon: {
    marginLeft: 6,
  },
  spacer: {
    flex: 1,
  },
  bottomRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  holdingsCount: {
    fontSize: 12,
    color: '#6b7280',
  },
  gainLoss: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginRight: 8,
  },
  performanceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  performanceBadgePositive: {
    backgroundColor: '#dcfce7',
  },
  performanceBadgeNegative: {
    backgroundColor: '#fee2e2',
  },
  performanceText: {
    fontSize: 12,
    fontWeight: '600',
  },
  performanceTextPositive: {
    color: '#16a34a',
  },
  performanceTextNegative: {
    color: '#dc2626',
  },
});

export default PortfolioCard;
