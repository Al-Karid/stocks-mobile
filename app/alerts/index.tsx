import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  Alert,
  StyleSheet,
  Pressable,
  Switch,
  TouchableOpacity,
  Platform,
  Modal,
} from 'react-native';
import { globalCardStyles } from '@/styles/globalStyles';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import { AlertData } from '@/types/alerts';
import { Colors } from '@/styles/colors';
import { Stock } from '@/types/stock';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useStockRepository } from '@/data/repositories/stockRepository';
import { useAlertStore } from '@/stores/alertStore';
import Collapsible from 'react-native-collapsible';
import { useSettingsStore } from '@/stores/settingsStore';

interface AlertItem extends AlertData {
  id: number;
}

const AlertsScreen: React.FC = () => {

  const { alerts: alertStore, removeAlert, fetchAlerts, toggleAlertState } = useAlertStore();
  const { showActionSheetWithOptions } = useActionSheet();
    const {
      userContraintCounts,
      increaseUserContraintCounts,
      decreaseUserContraintCounts,
    } = useSettingsStore();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [androidModalVisible, setAndroidModalVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const loadAlerts = async () => {
      await fetchAlerts();
    };
    loadAlerts();
  }
    , []);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity onPress={() => openStockModal()}>
            <MaterialIcons
              style={{ marginRight: 5, marginTop: 0 }}
              name="notification-add" size={23} color={Colors.headerBlue} />
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation]);

  const handleDelete = (alert: AlertData) => {
    Alert.alert(alert.stockTitle!, 'Delete this alert ?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          removeAlert(alert.id);
          increaseUserContraintCounts('maxAlerts');
        },
      },
    ]);
  };

  const openActionSheet = (alert: AlertData) => {
    const options = ['Edit', 'Delete', 'Cancel'];
    const destructiveButtonIndex = 1;
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        title: `${alert.stockTitle}`,
      },
      (index?: number) => {
        if (index === 0) {
          router.push({
            pathname: '/alerts/form',
            params: {
              alertId: alert.id,
            },
          });
        } else if (index === 1) {
          handleDelete(alert);
        }
      }
    );
  };

  const [stocks, setStocks] = useState<Stock[]>([]);
  const { fetchStocks } = useStockRepository();

  useEffect(() => {
    const loadStocks = async () => {
      const result = await fetchStocks();
      setStocks(result);
    };
    loadStocks();
  }, []);

  const openStockModal = () => {
    Platform.OS === 'ios'
      ? bottomSheetModalRef.current?.present()
      : setAndroidModalVisible(true);
  };

  const closeStockModal = () => {
    Platform.OS === 'ios'
      ? bottomSheetModalRef.current?.dismiss()
      : setAndroidModalVisible(false);
  };

  const handleStockSelect = (stock: Stock) => {
    closeStockModal();
    router.push({
      pathname: '/alerts/form',
      params: {
        stockSymbol: stock.symbol,
        stockTitle: stock.title,
      },
    });
  };

  const renderStockItem = ({ item }: { item: Stock }) => (
    <Pressable onPress={() => handleStockSelect(item)} style={styles.stockItem}>
      <Text style={styles.stockItemText}>{item.title}</Text>
    </Pressable>
  );

  const renderStockSelector = () => (
    <>
      <Text style={styles.modalTitle}>Sélectionner une action</Text>
      <FlatList
        data={stocks}
        keyExtractor={(item) => item.symbol}
        renderItem={renderStockItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      <View style={{ marginTop: 16 }}>
        <Pressable onPress={closeStockModal} style={styles.modalCancelButton}>
          <Text style={styles.modalCancelButtonText}>Annuler</Text>
        </Pressable>
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={alertStore}
        contentContainerStyle={{ paddingTop: 16 }}
        contentInsetAdjustmentBehavior='automatic'
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={() => (
          <View style={{ padding: 20 }}>
            <Text style={{ textAlign: 'center', color: '#475569' }}>
              No alerts set. Tap the '+' button to add one.
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            onLongPress={() => openActionSheet(item)}
          >
            <View style={globalCardStyles.card}>
              <View style={styles.header}>
                {/* <Text style={styles.stock}>{item.stockSymbol}</Text> */}
                <Text style={styles.cardName}>{item.stockTitle}</Text>
                {
                  Platform.OS === "ios" ? (
                    <Switch
                      value={Boolean(item.enabled)}
                      onValueChange={() => toggleAlertState(item.id)}
                    />
                  ) : (
                    <Switch
                      value={Boolean(item.enabled)}
                      onValueChange={() => toggleAlertState(item.id)}
                      trackColor={{ false: '#ccc', true: '#000' }}
                      thumbColor={item.enabled ? '#000' : '#f4f3f4'}
                    />
                  )
                }

              </View>

              <View style={styles.cardContent}>
                {/* <Text style={styles.cardName}>{item.stockSymbol}</Text> */}
                <Text
                  style={[
                  styles.cardCondition,
                  { color: item.enabled ? (item.alertType === 'above' ? '#4CAF50' : '#F44336') : '#9E9E9E' },
                  ]}
                >
                  {item.alertType === 'above' ? (
                  <>
                    <Feather name="arrow-up" size={16} color={item.enabled ? '#4CAF50' : '#9E9E9E'} /> above {item.value}
                  </>
                  ) : (
                  <>
                    <Feather name="arrow-down" size={16} color={item.enabled ? '#F44336' : '#9E9E9E'} /> below {item.value}
                  </>
                  )}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Floating Action Button */}
      {Platform.OS === "android" && (
        <Pressable
          disabled={userContraintCounts.maxAlerts == 0}
          onPress={() => {
            setAndroidModalVisible(true);
          }}
          style={styles.fab}
        >
          <Feather name="plus" size={24} color="white" />
        </Pressable>
      )}

      {/* iOS Bottom Sheet */}
      {Platform.OS === 'ios' && (
        <BottomSheetModal ref={bottomSheetModalRef} index={0} snapPoints={['60%']}>
          <BottomSheetView style={{ flex: 1, padding: 20 }}>
            {renderStockSelector()}
          </BottomSheetView>
        </BottomSheetModal>
      )}

      {/* Android Fullscreen Modal */}
      {Platform.OS === 'android' && (
        <Modal visible={androidModalVisible} animationType="slide">
          <View style={{ flex: 1, padding: 20 }}>{renderStockSelector()}</View>
        </Modal>
      )}
    </View>
  );
};

export default AlertsScreen;

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, paddingTop: 8 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginBottom: 10,
  },
  stock: {
    fontSize: 18,
    fontWeight: '500',
    color: '#123456',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10
  },
  cardName: {
    fontSize: 14,
    color: '#475569',
  },
  cardCondition: {
    fontSize: 16,
    color: '#4CAF50',
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "black", // Purple for modern look
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // For Android shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
  },
  stockSelector: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    marginBottom: 15,
  },
  stockSelectorText: {
    fontSize: 16,
    color: '#333',
  },
  stockItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  stockItemText: {
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  modalCancelButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalCancelButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
