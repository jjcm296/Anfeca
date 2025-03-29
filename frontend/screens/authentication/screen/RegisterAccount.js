import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import { useNavigation } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';

import CustomButton from '../../ui/components/CustomButton';
import EyeToggleButton from '../../ui/components/EyeToggleButton';

const RegisterAccount = () => {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.card}>
                <Text style={styles.title}>Crear cuenta</Text>

                <View style={styles.inputWrapper}>
                    <Ionicons name="person-outline" size={20} color="#555" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Nombre(s)"
                        autoCapitalize="words"
                        placeholderTextColor="#999"
                    />
                </View>

                <View style={styles.rowContainer}>
                    <View style={styles.inputWrapperHalf}>
                        <TextInput
                            style={styles.input}
                            placeholder="Apellido Paterno"
                            autoCapitalize="words"
                            placeholderTextColor="#999"
                        />
                    </View>
                    <View style={styles.inputWrapperHalf}>
                        <TextInput
                            style={styles.input}
                            placeholder="Apellido Materno"
                            autoCapitalize="words"
                            placeholderTextColor="#999"
                        />
                    </View>
                </View>

                <View style={styles.inputWrapper}>
                    <Ionicons name="mail-outline" size={20} color="#555" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Correo electrónico"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor="#999"
                    />
                </View>

                <View style={styles.inputWrapper}>
                    <Ionicons
                        name={showPassword ? 'lock-open-outline' : 'lock-closed-outline'}
                        size={20}
                        color="#555"
                        style={styles.icon}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Contraseña"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        placeholderTextColor="#999"
                    />
                    <EyeToggleButton
                        isVisible={showPassword}
                        onPress={() => setShowPassword(!showPassword)}
                    />
                </View>

                <View style={styles.inputWrapper}>
                    <Ionicons
                        name={showConfirmPassword ? 'lock-open-outline' : 'lock-closed-outline'}
                        size={20}
                        color="#555"
                        style={styles.icon}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirmar contraseña"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showConfirmPassword}
                        placeholderTextColor="#999"
                    />
                    <EyeToggleButton
                        isVisible={showConfirmPassword}
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                </View>

                <CustomButton
                    onPress={() => navigation.navigate("VerificationCode")}
                    text="Crear Cuenta"
                    textColor={'#FFFFFF'}
                    color={'#000000'}
                />

                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.registerText}>
                        ¿Ya tienes cuenta? <Text style={{ textDecorationLine: 'underline' }}>Inicia sesión</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    card: {
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 15,
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 10,
        width: '100%',
        height: 45,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    inputWrapperHalf: {
        borderRadius: 10,
        paddingHorizontal: 10,
        flex: 1,
        height: 45,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        marginBottom: 10,
        width: '100%',
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#333',
    },
    icon: {
        marginRight: 8,
    },
    registerText: {
        marginTop: 20,
        fontSize: 14,
        textAlign: 'center',
        color: '#333',
    },
});

export default RegisterAccount;
