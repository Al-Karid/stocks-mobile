import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User } from '@/types/user';
import { router } from 'expo-router';
import { useUserStore } from '@/stores/userStore';

export default function RegisterScreen() {

    const { saveUser } = useUserStore();

    const [username, setUsername] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const canSavePassword = false;

    const handleRegister = () => {

        if (username === '' || displayName === '' || phone === '') {
            alert("Please fill in all fields");
            return;
        }
        if (!/^\d+$/.test(phone)) {
            alert("Phone number must be numeric");
            return;
        }
        if (phone.length != 10) {
            alert("Phone number must be 10 digits long");
            return;
        }
        if (username.length < 3) {
            alert("Username must be at least 3 characters long");
            return;
        }

        const newUser: User = {
            username: username.toLowerCase(),
            name: displayName,
            phone,
            email: '',
            password: '',
            createdAt: new Date().toISOString(),
        };
        saveUser(newUser);
        router.back();
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                contentInsetAdjustmentBehavior='automatic'
                keyboardShouldPersistTaps="handled">
                <Text style={styles.title}>Create your account</Text>
                <Text style={styles.subtitle}>Just a few details to get started</Text>

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

                    <View style={styles.row}>
                        <Ionicons name="id-card-outline" size={18} color="#666" style={styles.icon} />
                        <TextInput
                            placeholder="Display name"
                            placeholderTextColor="#aaa"
                            style={styles.input}
                            value={displayName}
                            onChangeText={setDisplayName}
                        />
                    </View>

                    <View style={[styles.row, styles.noBorder]}>
                        <Ionicons name="call-outline" size={18} color="#666" style={styles.icon} />
                        <TextInput
                            placeholder="Phone number"
                            placeholderTextColor="#aaa"
                            style={styles.input}
                            keyboardType="phone-pad"
                            value={phone}
                            onChangeText={setPhone}
                        />
                    </View>
                </View>

                {canSavePassword && (
                    <View style={styles.section}>
                        <View style={[styles.row, styles.noBorder]}>
                            <Ionicons name="lock-closed-outline" size={18} color="#666" style={styles.icon} />
                            <TextInput
                                placeholder="Password"
                                placeholderTextColor="#aaa"
                                value={password}
                                onChangeText={setPassword}
                                style={styles.input}
                                secureTextEntry
                            />
                        </View>
                        <View style={[styles.row, styles.noBorder]}>
                            <Ionicons name="lock-closed-outline" size={18} color="#666" style={styles.icon} />
                            <TextInput
                                placeholder="confirm password"
                                placeholderTextColor="#aaa"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                style={styles.input}
                                secureTextEntry
                            />
                        </View>
                    </View>
                )}

                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Register</Text>
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
        backgroundColor: '#000',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
});
