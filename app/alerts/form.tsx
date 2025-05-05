import { Colors } from '@/styles/colors';
import { AlertData } from '@/types/alerts';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useAlertStore } from '@/stores/alertStore';
import {
  View,
  TextInput,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { getDevicePushToken } from '@/services/pushTokenService';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export default function AlertFormModal() {

  const navigation = useNavigation();

  const { stockSymbol, stockTitle, alertId: alertToEditId } = useLocalSearchParams();
  const { alerts, addAlert, updateAlert, notificationChannels } = useAlertStore();

  const [alertType, setAlertType] = useState<'below' | 'above'>('above')
  const [alertThreshold, setAlertThreshold] = useState("2500")
  const [alertStockTitle, setAlertStockTitle] = useState(stockTitle)
  const [enabled, setEnabled] = useState(false)
  const [alertToEdit, setAlertToEdit] = useState<AlertData | null>(null);

  useEffect(() => {
    if (alertToEditId) {
      const editingAlert = alerts?.find((alert) => alert.id === Number(alertToEditId));
      if (!editingAlert) return;
      setAlertToEdit(editingAlert);
      setAlertStockTitle(editingAlert.stockTitle!);
      setAlertType(editingAlert.alertType);
      setAlertThreshold(String(editingAlert.value));
      setEnabled(editingAlert.enabled);
    }
  }, [alertToEditId]);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      navigation.setOptions({
        headerTitle: alertToEditId ? 'Edit Alert' : 'New Alert',
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: Colors.headerBlue, fontSize: 16 }}>Cancel</Text>
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity onPress={() => handleSubmit()}>
            <Text style={{ color: Colors.headerBlue, fontSize: 16 }}>Save</Text>
          </TouchableOpacity>
        )
      });
    }else {
      navigation.setOptions({
        headerTitle: alertToEditId ? 'Edit Alert' : 'New Alert'})
  }}, [alertThreshold, alertType, enabled]);

  const handleSubmit = async () => {
    try {
      const newAlert: AlertData = {
        id: alertToEditId ? Number(alertToEditId) : 0,
        uuid: alertToEditId ? String(alertToEdit?.uuid) : uuidv4(),
        devicePushToken: await getDevicePushToken(),
        stockSymbol: alertToEditId ? alertToEdit?.stockSymbol! : String(stockSymbol),
        alertType: alertType,
        stockTitle: alertToEditId ? alertToEdit?.stockTitle! : String(stockTitle),
        value: Number(alertThreshold.trim()),
        enabled,
        synced: false,
        notificationChannels: JSON.stringify(notificationChannels),
        deleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      if (alertToEditId) {
        updateAlert(newAlert);
      } else {
        addAlert(newAlert);
      }
      // addAlert(newAlert);
      router.back();
    } catch (error) {
      console.error("Error saving alert:", error);
      Alert.alert(
        "Error",
        "There was an error saving the alert. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

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
                {alertStockTitle || 'Choisir une action'}
              </Text>
            </Pressable>

            <Text style={styles.label}>Alert Type</Text>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[styles.toggleButton, alertType === 'above' && styles.selectedToggle]}
                onPress={() => setAlertType('above')}
              >
                <Text style={alertType === 'above' ? styles.selectedText : styles.toggleText}>Above</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, alertType === 'below' && styles.selectedToggle]}
                onPress={() => setAlertType('below')}
              >
                <Text style={alertType === 'below' ? styles.selectedText : styles.toggleText}>Below</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Target Value</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter target value"
              keyboardType="numeric"
              value={alertThreshold}
              onChangeText={setAlertThreshold}
            />

            <View style={styles.row}>
              <Text style={styles.label}>Enabled</Text>
              <Switch
                value={Boolean(enabled)}
                onValueChange={setEnabled}
                trackColor={{ false: '#ccc', true: '#000' }}
                thumbColor={enabled ? '#000' : '#f4f3f4'}
              />
            </View>
            {
              Platform.OS === 'android' && (
                <View>
                  <TouchableOpacity style={styles.saveButton} onPress={() => handleSubmit()}>
                    <Text style={styles.saveText}>Save</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              )
            }
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

    </View>
  );
};

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
