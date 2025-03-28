import React, { useState } from 'react';
import {useNavigation} from "@react-navigation/native";
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    Alert
} from 'react-native';

import CustomInput from '../../ui/components/CustomInput';
import CustomButton from '../../ui/components/CustomButton';
import HomeScreen from "../../home/Home";

const CreateChildAccount = () => {
    const navigation = useNavigation();

    const [childName, setChildName] = useState('');

    const handleSubmit = () => {
        if (childName.trim() === '') {
            Alert.alert('Error', 'Por favor ingresa el nombre del niño');
            return;
        }
        Alert.alert('¡Éxito!', `Nombre registrado: ${childName}`);
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
                />

                <CustomButton
                    text="Confirmar"
                    onPress={() => navigation.navigate("MainTabs")}
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
});

export default CreateChildAccount;
