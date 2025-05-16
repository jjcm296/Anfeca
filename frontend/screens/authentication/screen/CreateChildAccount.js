import React, { useState } from 'react';
import { useNavigation } from "@react-navigation/native";
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import CustomInput from '../../ui/components/CustomInput';
import CustomButton from '../../ui/components/CustomButton';
import { ApiCreateKid } from "../../../api/ApiAccount";

const CreateChildAccount = () => {
    const navigation = useNavigation();
    const [childName, setChildName] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = async () => {
        if (childName.trim() === '') {
            setError(true);
            return;
        }

        const response = await ApiCreateKid({ name: childName });

        if (response.error) {
            setError(true);
            console.error("Error al crear la cuenta del niño:", response.error);
        } else {
            console.log("Cuenta creada correctamente de:", response.name, "con niño:", childName);
            navigation.navigate("MainTabs");
        }
    };

    return (
        <LinearGradient colors={['#2faaf6', '#ffffff']} style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.innerContainer}
            >
                <ScrollView contentContainerStyle={styles.scroll}>
                    <View style={styles.card}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>Nombre del niño</Text>
                            <Text style={styles.subtitle}>
                                Ingresa el nombre del niño para crear su cuenta
                            </Text>
                        </View>

                        <CustomInput
                            placeholder="Ej. Daniel"
                            value={childName}
                            onChangeText={setChildName}
                            style={error ? styles.inputError : null}
                        />
                        {error && <Text style={styles.errorText}>Este campo es obligatorio</Text>}

                        <CustomButton
                            text="Confirmar"
                            onPress={handleSubmit}
                            color="#2f5c98"
                            textColor="#FFF"
                            style={styles.button}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    scroll: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 20,
        width: '100%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#2f5c98',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    button: {
        width: '100%',
        marginTop: 10,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 5,
        marginTop: -5,
        marginLeft: 5,
    },
    inputError: {
        borderColor: 'red',
        borderWidth: 1,
    },
});

export default CreateChildAccount;
