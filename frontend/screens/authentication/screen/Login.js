import React, { useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Modal,
    ScrollView,
    Image,
} from 'react-native';
import { useNavigation } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { jwtDecode } from 'jwt-decode';
import { SessionContext } from '../../../context/SessionContext';

import CustomButton from '../../ui/components/CustomButton';
import EyeToggleButton from '../../ui/components/EyeToggleButton';
import { LinearGradient } from 'expo-linear-gradient';

import { ApiLogin } from '../../../api/ApiLogin';

const Login = ({ route }) => {
    const navigation = useNavigation();
    const { updateSessionFromToken } = useContext(SessionContext);

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
        if (!email || !password) return;

        try {
            const response = await ApiLogin(email, password);
            if (response.error) return;

            await SecureStore.setItemAsync('accessToken', response.accessToken);
            await SecureStore.setItemAsync('refreshToken', response.refreshToken);

            const decoded = jwtDecode(response.accessToken);
            updateSessionFromToken(response.accessToken, decoded);

            navigation.navigate('MainTabs');
        } catch (error) {
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
                            color="#2faaf6"
                            textColor="#FFF"
                            onPress={() => setShowModal(false)}
                        />
                    </View>
                </View>
            </Modal>

            <LinearGradient colors={['#2faaf6', '#ffffff']} style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <Image
                        source={require('../../../assets/mascota/Feliz.png')}
                        style={styles.image}
                        resizeMode="contain"
                    />

                    <View style={styles.card}>
                        <Text style={styles.title}>Iniciar Sesión</Text>

                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={20} color="#2f5c98" style={styles.icon} />
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
                                color="#2f5c98"
                                style={styles.icon}
                            />
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
                            color="#2faaf6"
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
            </LinearGradient>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        paddingTop: 90,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    image: {
        width: 160,
        height: 160,
    },
    card: {
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 15,
        width: '100%',
        maxWidth: 400,
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
        color: '#2f5c98',
    },
    inputContainer: {
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2faaf6',
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
        color: '#2f5c98',
        marginBottom: 10,
    },
    registerText: {
        fontSize: 14,
        textAlign: 'center',
        color: '#2f5c98',
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
        color: '#2f5c98',
    },
    modalText: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
        color: '#444',
    },
});

export default Login;
