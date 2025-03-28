import React, { useState } from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput
} from 'react-native';
import { useNavigation } from "@react-navigation/native";

import CustomInput from '../../ui/components/CustomInput';
import CustomButton from '../../ui/components/CustomButton';
import EyeToggleButton from '../../ui/components/EyeToggleButton';

const Login = () => {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.card}>
                <Text style={styles.title}>Iniciar Sesión</Text>

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

                <TouchableOpacity>
                    <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
                </TouchableOpacity>

                <CustomButton
                    text="Iniciar sesión"
                    color="#000"
                    textColor="#FFF"
                    onPress={() => navigation.navigate('MainTabs')}
                />

                <TouchableOpacity style={{ marginTop: 20 }} onPress={() => navigation.navigate('RegisterAccount')}>
                    <Text style={styles.registerText}>
                        ¿Aún no tienes cuenta? <Text style={{ textDecorationLine: 'underline' }}>Regístrate</Text>
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
    forgotText: {
        alignSelf: 'flex-end',
        fontSize: 13,
        color: '#333',
        textDecorationLine: 'underline',
    },
    registerText: {
        fontSize: 14,
        textAlign: 'center',
        color: '#333',
    },
});

export default Login;
