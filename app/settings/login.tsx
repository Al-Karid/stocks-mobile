import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');

  const handleLogin = () => {
    console.log('Logging in with:', { username, phone });
    // login logic here
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Login to your account</Text>

        <View style={styles.section}>
          <View style={styles.row}>
            <Ionicons name="person-outline" size={18} color="#666" style={styles.icon} />
            <TextInput
              placeholder="Username"
              placeholderTextColor="#aaa"
              style={styles.input}
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <View style={[styles.row, styles.noBorder]}>
            <Ionicons name="lock-closed-outline" size={18} color="#666" style={styles.icon} />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#aaa"
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              secureTextEntry
            />
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 32,
  },
  section: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 40,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  button: {
    backgroundColor: '#00FF7F',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#00FF7F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#121212',
  },
});
