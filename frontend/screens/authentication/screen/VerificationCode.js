import React, { useRef, useState, useContext } from 'react';
import { useNavigation } from "@react-navigation/native";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import CustomButton from '../../ui/components/CustomButton';
import { AccountContext } from '../../../context/AccountContext';
import { GuardianContext } from '../../../context/GuardianContext';
import { ApiAccount, ApiVerifyCode } from "../../../api/ApiAccount";
import { ApiLogin } from "../../../api/ApiLogin";
import * as SecureStore from "expo-secure-store";

const VerificationCode = () => {
    const navigation = useNavigation();
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState(false);
    const inputs = useRef([]);

    const { guardian } = useContext(GuardianContext);
    const { account } = useContext(AccountContext);

    const body = {
        name: guardian.name,
        lastName: guardian.lastName,
        email: account.email,
        password: account.password,
    };

    const bodyCode = {
        email: account.email,
        code: code.join(''),
    };

    const handleChange = (text, index) => {
        const newCode = [...code];
        newCode[index] = text.slice(-1);
        setCode(newCode);
        if (text && index < inputs.current.length - 1) {
            inputs.current[index + 1].focus();
        }
    };

    const handleBackspace = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && code[index] === '' && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    const handleVerify = async () => {
        try {
            const response = await ApiVerifyCode(bodyCode);
            if (response.error) return;
            await handleCreateAccount();
        } catch (error) {
            console.error("Error al verificar código:", error);
        }
    };

    const handleCreateAccount = async () => {
        try {
            const response = await ApiAccount(body);
            if (response.error === "Email already in use") {
                navigation.navigate("Login", { email: account.email });
                return;
            }
            if (response.error) return;

            const responseLogin = await ApiLogin(account.email, account.password);
            await SecureStore.setItemAsync('accessToken', responseLogin.accessToken);
            await SecureStore.setItemAsync('refreshToken', responseLogin.refreshToken);
            navigation.navigate("CreateChildAccount");
        } catch (error) {
            console.error("Error al crear cuenta:", error);
        }
    };

    return (
        <LinearGradient colors={['#2faaf6', '#ffffff']} style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.wrapper}
            >
                <View style={styles.card}>
                    <Text style={styles.title}>Código de verificación</Text>
                    <Text style={styles.subtitle}>Ingresa el código que enviamos a tu correo</Text>

                    <View style={styles.codeContainer}>
                        {code.map((value, index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => (inputs.current[index] = ref)}
                                value={value}
                                onChangeText={(text) => handleChange(text, index)}
                                onKeyPress={(e) => handleBackspace(e, index)}
                                style={[styles.codeInput, error && styles.codeInputError]}
                                keyboardType="numeric"
                                maxLength={1}
                            />
                        ))}
                    </View>

                    {error && <Text style={styles.errorText}>Código incorrecto. Intenta nuevamente.</Text>}

                    <View style={styles.buttonContainer}>
                        <CustomButton
                            onPress={handleVerify}
                            text="Verificar código"
                            color="#2f5c98"
                            textColor="#FFF"
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    wrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    card: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 20,
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#2f5c98',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 25,
    },
    codeContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        marginBottom: 10,
    },

    codeInput: {
        width: 45,
        height: 50,
        borderWidth: 1.5,
        borderColor: '#2faaf6',
        borderRadius: 10,
        textAlign: 'center',
        fontSize: 18,
        backgroundColor: '#f9f9f9',
    },
    codeInputError: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 10,
    },
    buttonContainer: {
        width: '100%',
        marginTop: 10,
    },
    resendText: {
        marginTop: 20,
        color: '#2f5c98',
        textDecorationLine: 'underline',
        fontWeight: 'bold',
    },
});

export default VerificationCode;
