import React, { useState } from 'react';
import {useNavigation} from "@react-navigation/native";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
} from 'react-native';

import CustomInput from '../../ui/components/CustomInput';
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
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Crear cuenta</Text>
                </View>

                <CustomInput placeholder="Nombre" />
                <CustomInput placeholder="Apellido Paterno" />
                <CustomInput placeholder="Apellido Materno" />
                <CustomInput
                    placeholder="Correo electrónico"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />

                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.input}
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

                {/* Confirmar contraseña */}
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Confirmar contraseña"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showConfirmPassword}
                    />
                    <EyeToggleButton
                        isVisible={showConfirmPassword}
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                </View>

                <CustomButton
                    onPress={()=> navigation.navigate("VerificationCode")}
                    text="Crear Cuenta"
                    textColor={'#FFFFFF'}
                    color={'#000000'} />

                <TouchableOpacity>
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
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
    },
    titleContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    passwordContainer: {
        height: 43,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 5,
        marginBottom: 8,
    },
    input: {
        flex: 1,
        fontSize: 15,
    },
    registerText: {
        alignSelf: 'center',
        marginTop: 20,
        fontSize: 14,
    },
});

export default RegisterAccount;
