import React, { useState } from 'react';
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
} from 'react-native';
import AlertFormModal, { AlertData } from './form';
import { globalCardStyles } from '@/styles/globalStyles';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { Feather } from '@expo/vector-icons';

interface AlertItem extends AlertData {
  id: number;
}

const AlertsScreen: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([
    { id: 1, stock: 'SOGC', name: "Société de Gestion du Coton", type: 'above', value: 5800, enabled: true },
    { id: 2, stock: 'BOAS', name: "Bank of Africa Sénégal", type: 'below', value: 7500, enabled: false },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingAlert, setEditingAlert] = useState<AlertItem | undefined>();
  const { showActionSheetWithOptions } = useActionSheet();

  const handleSave = (alertData: AlertData) => {
    if (editingAlert) {
      setAlerts(prev =>
        prev.map(a => (a.id === editingAlert.id ? { ...a, ...alertData } : a))
      );
    } else {
      const newId = Math.max(0, ...alerts.map(a => a.id)) + 1;
      setAlerts(prev => [...prev, { ...alertData, id: newId }]);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert('Delete Alert', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setAlerts(prev => prev.filter(a => a.id !== id));
        },
      },
    ]);
  };

  const toggleEnabled = (id: number) => {
    setAlerts(prev =>
      prev.map(a => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  };

  const openActionSheet = (alert: AlertItem) => {
    const options = ['Edit', 'Delete', 'Cancel'];
    const destructiveButtonIndex = 1;
    const cancelButtonIndex = 2;

    // Debugging action sheet hook to see if it's triggered correctly
    console.log("Opening action sheet for alert:", alert);

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        title: `Manage ${alert.stock}`,
      },
      (index?: number) => {
        if (index === 0) {
          setEditingAlert(alert);
          setModalVisible(true);
        } else if (index === 1) {
          handleDelete(alert.id);
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={alerts}
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
            onLongPress={() => openActionSheet(item)} // Long press to show action sheet
          >
            <View style={globalCardStyles.card}>
              <View style={styles.header}>
                <Text style={styles.stock}>{item.stock}</Text>
                <Switch
                  value={item.enabled}
                  onValueChange={() => toggleEnabled(item.id)}
                  trackColor={{ false: '#ccc', true: '#000' }}
                  thumbColor={item.enabled ? '#000' : '#f4f3f4'}
                />
              </View>

              <View style={styles.cardContent}>
                <Text style={styles.cardName}>{item.name}</Text>
                <Text style={styles.cardCondition}>
                  {item.type === 'above' ? 'Above' : 'Below'} {item.value}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Floating Action Button */}
      {Platform.OS === "android" && (
        <Pressable
          onPress={() => {
            setEditingAlert(undefined);
            setModalVisible(true);
          }}
          style={styles.fab}
        >
          <Feather name="plus" size={24} color="white" />
        </Pressable>
      )}

      <AlertFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
        editingAlert={editingAlert}
      />
    </View>
  );
};

export default AlertsScreen;

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#f9fafb' },
  card: {
    // backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginHorizontal: 10,
    backgroundColor: 'linear-gradient(to right, #f0f4f8, #e0e6f1)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
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
  },
  cardName: {
    fontSize: 12,
    color: '#475569',
  },
  cardCondition: {
    fontSize: 16,
    color: '#4CAF50', // Use green for 'above' type for visual cue
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
});
