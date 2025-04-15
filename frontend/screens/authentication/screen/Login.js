import React, { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Modal,
} from 'react-native';
import { useNavigation } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';

import CustomButton from '../../ui/components/CustomButton';
import EyeToggleButton from '../../ui/components/EyeToggleButton';

import { ApiRefreshAccessToken } from '../../../api/ApiLogin';

const Login = ({ route }) => {
    const navigation = useNavigation();

    const [email, setEmail] = useState(route?.params?.email || '');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (route?.params?.email) {
            setShowModal(true);
        }
    }, [route?.params?.email]);

    const handleLogin = async () => {
        if (!email || !password) {
            console.log('Por favor ingresa el correo y la contraseña');
            return;
        }

        try {
            const response = await ApiRefreshAccessToken();

            if (response.error) {
                console.log('Error:', response.error);
            } else {
                console.log(response.message);
                console.log('Token de acceso guardado:', response.accessToken);
                navigation.navigate('MainTabs');
            }
        } catch (error) {
            console.error('Error inesperado al iniciar sesión:', error.message);
        }
    };

    return (
        <>
            <Modal visible={showModal} transparent animationType="fade">
                <View style={styles.modalBackground}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Correo ya registrado</Text>
                        <Text style={styles.modalText}>
                            Este correo ya está registrado. Por favor, inicia sesión.
                        </Text>
                        <CustomButton
                            text="Entendido"
                            color="#000"
                            textColor="#FFF"
                            onPress={() => setShowModal(false)}
                        />
                    </View>
                </View>
            </Modal>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.card}>
                    <Text style={styles.title}>Iniciar Sesión</Text>

                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={20} color="#555" style={styles.icon} />
                        <TextInput
                            style={styles.flexInput}
                            placeholder="Correo electrónico"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons
                            name={showPassword ? 'lock-open-outline' : 'lock-closed-outline'}
                            size={20}
                            color="#555"
                            style={styles.icon} />
                        <TextInput
                            style={styles.flexInput}
                            placeholder="Contraseña"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                        />
                        <EyeToggleButton
                            isVisible={showPassword}
                            onPress={() => setShowPassword(!showPassword)}
                        />
                    </View>

                    <TouchableOpacity>
                        <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
                    </TouchableOpacity>

                    <CustomButton
                        text="Iniciar sesión"
                        color="#000"
                        textColor="#FFF"
                        onPress={handleLogin}
                    />

                    <TouchableOpacity style={{ marginTop: 20 }} onPress={() => navigation.navigate('RegisterAccount')}>
                        <Text style={styles.registerText}>
                            ¿Aún no tienes cuenta? <Text style={{ textDecorationLine: 'underline' }}>Regístrate</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f2f2f2',
    },
    card: {
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 15,
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    inputContainer: {
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    icon: {
        marginRight: 8,
    },
    flexInput: {
        flex: 1,
        fontSize: 15,
    },
    forgotText: {
        alignSelf: 'flex-end',
        fontSize: 13,
        textDecorationLine: 'underline',
        color: '#333',
    },
    registerText: {
        fontSize: 14,
        textAlign: 'center',
        color: '#333',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalCard: {
        backgroundColor: '#fff',
        padding: 25,
        borderRadius: 15,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    modalText: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
        color: '#444',
    },
});

export default Login;
