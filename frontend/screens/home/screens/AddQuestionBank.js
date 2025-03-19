import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import FakeDatabase from '../../../fakeDataBase/FakeDataBase';
import CustomButton from '../../ui/components/CustomButton'; // Importa el botón reutilizable

const AddQuestionBank = ({ navigation }) => {
    const [category, setCategory] = useState('');
    const [questionCount, setQuestionCount] = useState('0');

    const handleSubmit = () => {
        if (category.trim() === '' || questionCount.trim() === '') {
            Alert.alert("Error", "Todos los campos son obligatorios.");
            return;
        }

        if (isNaN(questionCount) || parseInt(questionCount) < 0) {
            Alert.alert("Error", "Ingrese un número válido para la cantidad de preguntas.");
            return;
        }

        FakeDatabase.addQuestionBank(category, parseInt(questionCount));

        Alert.alert("Éxito", "Banco de preguntas agregado correctamente.");
        navigation.goBack(); // 🔙 Regresa a la pantalla anterior
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Agregar Nuevo Banco de Preguntas</Text>

            {/* Campo para ingresar el nombre del banco de preguntas */}
            <TextInput
                style={styles.input}
                placeholder="Nombre de la categoría..."
                value={category}
                onChangeText={setCategory}
            />

            {/* Botón reutilizable */}
            <CustomButton
                color="#6200EE"
                text="Agregar Banco"
                onPress={handleSubmit}
                disabled={category.trim() === '' || questionCount.trim() === ''}
            />
        </View>
    );
};

// 🔹 Estilos
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

export default AddQuestionBank;
