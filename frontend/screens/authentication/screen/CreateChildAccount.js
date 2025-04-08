import React, { useState } from 'react';
import { useNavigation } from "@react-navigation/native";
import {
    ScrollView,
    View,
    Text,
    StyleSheet
} from 'react-native';

import CustomInput from '../../ui/components/CustomInput';
import CustomButton from '../../ui/components/CustomButton';
import DB from '../../../fakeDataBase/FakeDataBase';
import {ApiCreateKid} from "../../../api/ApiAccount";

const CreateChildAccount = () => {
    const navigation = useNavigation();

    const [childName, setChildName] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = async () => {
        if (childName.trim() === '') {
            setError(true);
            return;
        }

        const response = await ApiCreateKid({name:childName});

        if (response.error) {
            setError(true);
            console.error("Error al crear la cuenta del niño:", response.error);
        } else {
            console.log("Cuenta creada correctamente de:", response.name, "con niño: ", childName);
            navigation.navigate("MainTabs");
        }

    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
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
                    color="#000"
                    textColor="#FFF"
                    style={styles.button}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
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
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
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
    },
    subtitle: {
        fontSize: 14,
        color: '#777',
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
