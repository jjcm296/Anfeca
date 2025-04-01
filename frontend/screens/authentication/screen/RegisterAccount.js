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

import {useContext} from 'react';

import { AccountContext } from '../../../context/AccountContext';
import { GuardianContext } from '../../../context/GuardianContext';

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

    const handleRegister = () => {
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

        setAccount({
            email,
            password,
        });

        setGuardian({
            name,
            lastName,
        });
x
        setErrors({});
        console.log("Cuenta creada correctamente desde el formulario");
        navigation.navigate("VerificationCode");
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.card}>
                <Text style={styles.title}>Crear cuenta</Text>

                <View style={[styles.inputWrapper, errors.name && styles.inputWrapperError]}>
                    <Ionicons name="person-outline" size={20} color="#555" style={styles.icon} />
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

                <View style={[styles.inputWrapper, errors.lastName && styles.inputWrapperError]}>
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

                <View style={[styles.inputWrapper, errors.email && styles.inputWrapperError]}>
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
                {errors.email && <Text style={styles.errorText}>Este campo es obligatorio</Text>}

                <View style={[styles.inputWrapper, errors.password && styles.inputWrapperError]}>
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
                {errors.password && <Text style={styles.errorText}>Este campo es obligatorio</Text>}

                <View style={[styles.inputWrapper, errors.confirmPassword && styles.inputWrapperError]}>
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
                {errors.confirmPassword && <Text style={styles.errorText}>Las contraseñas no coinciden o está vacío</Text>}

                <View style={{ width: '100%' }}>
                    <CustomButton
                        onPress={handleRegister}
                        text="Crear Cuenta"
                        textColor="#FFFFFF"
                        color="#000000"
                    />
                </View>


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
    inputWrapperError: {
        borderColor: 'red',
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
    errorText: {
        alignSelf: 'flex-start',
        color: 'red',
        fontSize: 12,
        marginBottom: 5,
        marginLeft: 5,
    },
    fullWidthButton: {
        width: '100%',
        marginTop: 10,
    },
});

export default RegisterAccount;