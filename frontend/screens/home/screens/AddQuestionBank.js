import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import FakeDatabase from '../../../fakeDataBase/FakeDataBase';
import CustomButton from '../../ui/components/CustomButton';
import CloseButton from "../../ui/components/CloseButton";
import {createBank} from "../../../api/ApiBank"; // Importa el botón reutilizable

const AddQuestionBank = ({ navigation }) => {
    const [category, setCategory] = useState('');

    const handleSubmit = () => {
        if (category.trim() === '') {
            Alert.alert("Error", "Todos los campos son obligatorios.");
            return;
        }

        try {
            const response = createBank({name: category});
            Alert.alert("Éxito", "Banco de preguntas agregado correctamente.");
            navigation.goBack();
        } catch (error) {
            Alert.alert("Error", "Error al agregar el banco de preguntas.");
        }
    };

    return (
        <View style={styles.container}>
            <CloseButton/>
            <Text style={styles.title}>Agregar Nuevo Banco de Preguntas</Text>

            {/* Campo para ingresar el nombre del banco de preguntas */}
            <TextInput
                style={styles.input}
                placeholder="Nombre de la categoría..."
                value={category}
                onChangeText={setCategory}
            />

            <View style={styles.buttons}>
                <CustomButton
                    color="#000000"
                    text="Agregar Banco"
                    onPress={handleSubmit}
                    disabled={category.trim() === ''}
                />
            </View>
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
    buttons: {
        marginTop: 20,
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
});

export default AddQuestionBank;
