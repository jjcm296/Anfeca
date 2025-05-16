import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
} from 'react-native';
import { useNavigation } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

import CustomButton from '../../ui/components/CustomButton';
import EyeToggleButton from '../../ui/components/EyeToggleButton';

import { AccountContext } from '../../../context/AccountContext';
import { GuardianContext } from '../../../context/GuardianContext';
import { ApiSendCode, ApiValidateEmail, ApiValidatePassword } from "../../../api/ApiAccount";

const RegisterAccount = () => {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');

    const [errors, setErrors] = useState({});

    const { setAccount } = useContext(AccountContext);
    const { setGuardian } = useContext(GuardianContext);

    const handleRegister = async () => {
        const newErrors = {};

        if (!name) newErrors.name = true;
        if (!lastName) newErrors.lastName = true;
        if (!email) newErrors.email = true;
        if (!password) newErrors.password = true;
        if (!confirmPassword) newErrors.confirmPassword = true;
        if (password !== confirmPassword) newErrors.confirmPassword = true;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const emailValidation = await ApiValidateEmail({ email });
            if (emailValidation.error) {
                setErrors(prev => ({ ...prev, email: "El correo electrónico no es válido." }));
                return;
            }
        } catch (error) {
            setErrors(prev => ({ ...prev, email: "Error en la validación del correo electrónico." }));
            return;
        }

        try {
            const passwordValidation = await ApiValidatePassword({ password });
            if (passwordValidation.error) {
                setErrors(prev => ({
                    ...prev,
                    password: "La contraseña no cumple con los requisitos de seguridad.",
                    confirmPassword: "La contraseña no cumple con los requisitos de seguridad.",
                }));
                return;
            }
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                password: "Error en la validación de la contraseña.",
                confirmPassword: "Error en la validación de la contraseña.",
            }));
            return;
        }

        setAccount({ email, password });
        setGuardian({ name, lastName });
        setErrors({});

        try {
            const response = await ApiSendCode({ email });
            if (response.error) return;
        } catch (error) {
            return;
        }

        navigation.navigate("VerificationCode");
    };

    return (
        <LinearGradient colors={['#2faaf6', '#ffffff']} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>

                {/* Imagen superior */}
                <Image
                    source={require('../../../assets/mascota/Pose1.png')}
                    style={styles.image}
                    resizeMode="contain"
                />

                <View style={styles.card}>
                    <Text style={styles.title}>Crear cuenta</Text>

                    <View style={[styles.inputContainer, errors.name && styles.inputWrapperError]}>
                        <Ionicons name="person-outline" size={20} color="#2f5c98" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre(s)"
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="words"
                            placeholderTextColor="#999"
                        />
                    </View>
                    {errors.name && <Text style={styles.errorText}>Este campo es obligatorio</Text>}

                    <View style={[styles.inputContainer, errors.lastName && styles.inputWrapperError]}>
                        <TextInput
                            style={styles.input}
                            placeholder="Apellido(s)"
                            value={lastName}
                            onChangeText={setLastName}
                            autoCapitalize="words"
                            placeholderTextColor="#999"
                        />
                    </View>
                    {errors.lastName && <Text style={styles.errorText}>Este campo es obligatorio</Text>}

                    <View style={[styles.inputContainer, errors.email && styles.inputWrapperError]}>
                        <Ionicons name="mail-outline" size={20} color="#2f5c98" style={styles.icon} />
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
                    {errors.email && (
                        <Text style={styles.errorText}>
                            {typeof errors.email === 'string'
                                ? errors.email
                                : 'Este campo es obligatorio'}
                        </Text>
                    )}

                    <View style={[styles.inputContainer, errors.password && styles.inputWrapperError]}>
                        <Ionicons
                            name={showPassword ? 'lock-open-outline' : 'lock-closed-outline'}
                            size={20}
                            color="#2f5c98"
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
                    {errors.password && (
                        <Text style={styles.errorText}>
                            {typeof errors.password === 'string'
                                ? errors.password
                                : 'La contraseña es obligatoria'}
                        </Text>
                    )}

                    <Text style={styles.passwordHint}>
                        La contraseña debe contener:
                        {'\n'}• Al menos una letra mayúscula
                        {'\n'}• Al menos un número
                        {'\n'}• Al menos un carácter especial (!@#\$%^&*)
                        {'\n'}• Mínimo 8 caracteres
                    </Text>

                    <View style={[styles.inputContainer, errors.confirmPassword && styles.inputWrapperError]}>
                        <Ionicons
                            name={showConfirmPassword ? 'lock-open-outline' : 'lock-closed-outline'}
                            size={20}
                            color="#2f5c98"
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
                    {errors.confirmPassword && (
                        <Text style={styles.errorText}>
                            {typeof errors.confirmPassword === 'string'
                                ? errors.confirmPassword
                                : 'Las contraseñas no coinciden o está vacío'}
                        </Text>
                    )}

                    <View style={{ width: '100%' }}>
                        <CustomButton
                            onPress={handleRegister}
                            text="Crear cuenta"
                            textColor="#FFFFFF"
                            color="#2f5c98"
                        />
                    </View>

                    <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                        <Text style={styles.registerText}>
                            ¿Ya tienes cuenta? <Text style={{ textDecorationLine: 'underline' }}>Inicia sesión</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 30,
        paddingHorizontal: 20,
    },
    image: {
        width: 130,
        height: 130,
    },
    card: {
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 15,
        width: '100%',
        maxWidth: 400,
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
        color: '#2f5c98',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 10,
        height: 45,
        width: '100%',
        borderWidth: 1,
        borderColor: '#2faaf6',
    },
    inputWrapperError: {
        borderColor: 'red',
    },
    input: {
        flex: 1,
        fontSize: 15,
    },
    icon: {
        marginRight: 8,
    },
    registerText: {
        marginTop: 20,
        fontSize: 14,
        textAlign: 'center',
        color: '#2f5c98',
    },
    errorText: {
        alignSelf: 'flex-start',
        color: 'red',
        fontSize: 12,
        marginBottom: 5,
        marginLeft: 5,
    },
    passwordHint: {
        alignSelf: 'flex-start',
        color: '#666',
        fontSize: 12,
        marginTop: -2,
        marginBottom: 10,
        marginLeft: 5,
    },
});

export default RegisterAccount;
