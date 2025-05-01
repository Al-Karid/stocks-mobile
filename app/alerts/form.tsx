import { useStockRepository } from '@/data/repositories/stockRepository';
import { Colors } from '@/styles/colors';
import { AlertData } from '@/types/alerts';
import { Stock } from '@/types/stock';
import { AntDesign } from '@expo/vector-icons';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { useAlertStore } from '@/stores/alertStore';
import {
  Modal,
  View,
  TextInput,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  FlatList,
  Pressable,
} from 'react-native';

const AlertFormModal = () => {

  const {stockSymbol: symbol, stockTitle: title, alertId: alertToEditId} = useLocalSearchParams();
  const { alerts, addAlert } = useAlertStore();
  
  const [stock, setStock] = useState('');
  const [type, setType] = useState<'above' | 'below'>('above');
  const [value, setValue] = useState('');
  const [enabled, setEnabled] = useState(true);

  const [stocks, setStocks] = useState<Stock[]>([]);
  const [stockTitle, setStockTitle] = useState(title || '');
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [androidModalVisible, setAndroidModalVisible] = useState(false);
  const { fetchStocks } = useStockRepository();
  const navigation = useNavigation();

  useEffect(() => {
    if (alertToEditId) {
      const editingAlert = alerts?.find((alert) => alert.id === Number(alertToEditId));
      if (!editingAlert) return;
      setStock(title as string || editingAlert.stockTitle || '');
      setType(editingAlert.type);
      setValue(String(editingAlert.value));
      setEnabled(editingAlert.enabled);
    } else {
      setStock(title as string || '');
      setType('above');
      setValue('2500');
      setEnabled(true);
    }
  }, [alertToEditId]);

  useEffect(() => {
    const loadStocks = async () => {
      const result = await fetchStocks();
      setStocks(result);
    };
    loadStocks();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: alertToEditId ? 'Edit Alert' : 'New Alert',
      headerLeft : () => (
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: Colors.headerBlue, fontSize: 16 }}>Cancel</Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => handleSubmit()}>
          <Text style={{ color: Colors.headerBlue, fontSize: 16 }}>Save</Text>
        </TouchableOpacity>
      ),
    });
  }, []);

  const handleSubmit = () => {
    if (!value) return;
    // onSave({id: 0, stock, type, value: parseFloat(value), enabled });
    addAlert({ id: alerts!.length+1, stockSymbol: stock, type, value: parseFloat(value), enabled });
    console.log({id: 0, stock, type, value: parseFloat(value), enabled });
    
    // router.back();
  };

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

  const handleStockSelect = (s: Stock) => {
    setStock(s.symbol);
    setStockTitle(s.title);
    closeStockModal();
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
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.modalWrapper}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.label}>Action</Text>
            <Pressable style={styles.stockSelector}>
              <Text style={styles.stockSelectorText}>
                {stockTitle || stock || 'Choisir une action'}
              </Text>
            </Pressable>

            <Text style={styles.label}>Alert Type</Text>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[styles.toggleButton, type === 'above' && styles.selectedToggle]}
                onPress={() => setType('above')}
              >
                {/* <AntDesign name="up" size={24} color="white" /> */}
                <Text style={type === 'above' ? styles.selectedText : styles.toggleText}>Above</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, type === 'below' && styles.selectedToggle]}
                onPress={() => setType('below')}
              >
                {/* <AntDesign name="down" size={24} color="white" /> */}
                <Text style={type === 'below' ? styles.selectedText : styles.toggleText}>Below</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Target Value</Text>
            <TextInput
              value={value}
              onChangeText={setValue}
              keyboardType="numeric"
              placeholder="e.g. 5800"
              style={styles.input}
            />

            <View style={styles.row}>
              <Text style={styles.label}>Enabled</Text>
              <Switch
                value={enabled}
                onValueChange={setEnabled}
                trackColor={{ false: '#ccc', true: '#000' }}
                thumbColor={enabled ? '#000' : '#f4f3f4'}
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      {
        Platform.OS === 'android' && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )
      }

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

export default AlertFormModal;

const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 120,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1f2937',
  },
  label: {
    fontSize: 15,
    color: '#4b5563',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 16,
    color: '#1f2937',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
  },
  toggleButton: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    borderRadius: 10,
  },
  selectedToggle: {
    backgroundColor: 'black',
  },
  toggleText: {
    color: '#374151',
    fontWeight: '500',
  },
  selectedText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: '#ffffff',
  },
  saveButton: {
    backgroundColor: 'black',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelText: {
    color: '#9ca3af',
    fontSize: 16,
    fontWeight: '600',
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
