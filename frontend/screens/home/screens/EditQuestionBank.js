import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import FakeDatabase from '../../../fakeDataBase/FakeDataBase';
import CustomButton from '../../ui/components/CustomButton';
import {deleteBank, getBankById} from "../../../api/ApiBank";
import {ApiRefreshAccessToken} from "../../../api/ApiLogin";

const EditQuestionBank = ({ route, navigation }) => {
    const { bankId } = route.params;
    const [category, setCategory] = useState('');

    // Cargar el nombre del banco de preguntas
    useEffect(() => {
        const fetchBank = async () => {
            await ApiRefreshAccessToken();
            const bank = getBankById(bankId);
            if (bank) {
                console.log("Banco de preguntas encontrado:", bank);
                setCategory(bank.name);
            } else {
                Alert.alert("Error", "Banco de preguntas no encontrado.");
                navigation.goBack();
            }
        }
    }, [bankId]);

    // Función para actualizar el banco de preguntas
    const handleUpdate = () => {
        if (category.trim() === '') {
            Alert.alert("Error", "El nombre de la categoría no puede estar vacío.");
            return;
        }

        FakeDatabase.updateQuestionBank(bankId, category);
        Alert.alert("Éxito", "Banco de preguntas actualizado correctamente.");
        navigation.goBack();
    };

    // Función para eliminar el banco de preguntas
    const handleDelete = () => {
        Alert.alert(
            "Confirmar eliminación",
            "¿Estás seguro de que deseas eliminar este banco de preguntas?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        await ApiRefreshAccessToken();
                        const deleted = await deleteBank(bankId);
                        if (deleted) {
                            Alert.alert("Éxito", "Banco de preguntas eliminado correctamente.");
                            navigation.goBack();
                        } else {
                            Alert.alert("Error", "No se pudo eliminar el banco de preguntas.");
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Editar Banco de Preguntas</Text>
            <TextInput
                style={styles.input}
                placeholder="Nombre de la categoría..."
                value={category}
                onChangeText={setCategory}
            />
            <CustomButton
                color={'#FF0000'} text={"Eliminar"} textColor={'#FFFFFF'} onPress={handleDelete}/>
            <CustomButton color="#6200EE" text="Actualizar" textColor={'#FFFFFF'} onPress={handleUpdate} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f8f8'
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center'
    },
    input: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        fontSize: 16,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd'
    },
});

export default EditQuestionBank;
