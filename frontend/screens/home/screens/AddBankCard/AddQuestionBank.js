import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import FakeDatabase from '../../../../fakeDataBase/FakeDataBase';

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

            {/* Botón para agregar el banco de preguntas */}
            <TouchableOpacity
                style={[
                    styles.addButton,
                    (category.trim() === '' || questionCount.trim() === '') && styles.disabledButton
                ]}
                onPress={handleSubmit}
                disabled={category.trim() === '' || questionCount.trim() === ''}
            >
                <Text style={styles.addButtonText}>Agregar Banco</Text>
            </TouchableOpacity>
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
    addButton: {
        backgroundColor: '#6200EE',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20
    },
    addButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
    disabledButton: {
        backgroundColor: '#B0B0B0'
    },
});

export default AddQuestionBank;
