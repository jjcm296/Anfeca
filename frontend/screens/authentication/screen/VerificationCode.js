import React, { useRef, useState, useContext } from 'react';
import { useNavigation } from "@react-navigation/native";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from 'react-native';

import CustomButton from '../../ui/components/CustomButton';
import DB from '../../../fakeDataBase/FakeDataBase';
import { AccountContext } from '../../../context/AccountContext';
import { GuardianContext } from '../../../context/GuardianContext';
import {ApiAccount} from "../../../api/ApiAccount";


const VerificationCode = () => {
    const navigation = useNavigation();

    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState(false);
    const inputs = useRef([]);

    //importamos el guardian y la cuenta que exportamos de registerAccount
    const { guardian } =useContext(GuardianContext);
    const { account } = useContext(AccountContext);

    //crearmos el objeto a enviar
    const body = {
        name: guardian.name,
        lastName: guardian.lastName,
        email: account.email,
        password: account.password,
    }

    const handleChange = (text, index) => {
        const newCode = [...code];
        newCode[index] = text.slice(-1);
        setCode(newCode);

        // Mover al siguiente input si no es el último
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
        const enteredCode = code.join('');

       console.log("body", body);
        if (DB.verifyCode(enteredCode)) {
            const response = await ApiAccount(body);
            console.log("Código verificado correctamente");

            try {
                console.log("Respuesta del backend:", response);
                if (response.error) {
                    console.error("Error al crear la cuenta:", response.error);
                    return;
                }else {
                    navigation.navigate("CreateChildAccount");
                }
            } catch (error) {
                console.error("Error al crear la cuenta:", error);
            }

        } else {
            setError(true);
        }
    };

    return (
        <View style={styles.container}>
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
                            autoFocus={index === 0}
                        />
                    ))}
                </View>
                {error && <Text style={styles.errorText}>Código incorrecto. Intenta nuevamente.</Text>}

                <View style={styles.buttonContainer}>
                    <CustomButton
                        onPress={handleVerify}
                        text="Verificar código"
                        color="#000"
                        textColor="#FFF"
                    />
                </View>

                <TouchableOpacity onPress={() => console.log('Reenviar código')}>
                    <Text style={styles.resendText}>Reenviar código</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
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
    buttonContainer: {
        width: 320,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        color: '#777',
        textAlign: 'center',
        marginBottom: 20,
    },
    codeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    codeInput: {
        width: 45,
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        textAlign: 'center',
        fontSize: 18,
    },
    codeInputError: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        marginTop: 10,
    },
    resendText: {
        marginTop: 20,
        color: '#000',
        textDecorationLine: 'underline',
    },
});

export default VerificationCode;
