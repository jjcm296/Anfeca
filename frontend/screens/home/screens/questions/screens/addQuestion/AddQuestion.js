import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FakeDatabase from '../../../../../../fakeDataBase/FakeDataBase';

const AddQuestionScreen = ({ route, navigation }) => {
    const { category } = route.params;
    const [question, setQuestion] = useState('');
    const [answers, setAnswers] = useState(['', '', '', '']);
    const [difficulty, setDifficulty] = useState('1');

    const handleAnswerChange = (text, index) => {
        const newAnswers = [...answers];
        newAnswers[index] = text;
        setAnswers(newAnswers);
    };

    const handleSubmit = () => {
        if (question.trim() === '' || answers.some(ans => ans.trim() === '')) {
            Alert.alert("Error", "Todos los campos son obligatorios.");
            return;
        }

        FakeDatabase.addQuestion(category, question);

        Alert.alert("Éxito", "Pregunta agregada correctamente.");
        navigation.goBack(); // 🔙 Regresa a la pantalla anterior
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Agregar Pregunta a {category}</Text>

            {/* Campo para ingresar la pregunta */}
            <TextInput
                style={styles.input}
                placeholder="Escribe la pregunta..."
                value={question}
                onChangeText={setQuestion}
            />

            {/* Campos para ingresar las respuestas */}
            {answers.map((answer, index) => (
                <TextInput
                    key={index}
                    style={styles.input}
                    placeholder={`Respuesta ${index + 1}`}
                    value={answer}
                    onChangeText={(text) => handleAnswerChange(text, index)}
                />
            ))}

            {/* Selector de dificultad */}
            <Text style={styles.label}>Selecciona Dificultad:</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={difficulty}
                    onValueChange={(itemValue) => setDifficulty(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="1 Coin" value="1" />
                    <Picker.Item label="2 Coins" value="2" />
                    <Picker.Item label="3 Coins" value="3" />
                </Picker>
                <FontAwesome5 name="coins" size={24} color="#FFD700" style={styles.icon} />
            </View>

            {/* Botón para agregar la pregunta */}
            <TouchableOpacity
                style={
                [styles.addButton, (question.trim() === '' || answers.some(ans => ans.trim() === '')) && styles.disabledButton]
            }
                onPress={handleSubmit}
                disabled={question.trim() === '' || answers.some(ans => ans.trim() === '')}
            >
                <Text style={styles.addButtonText}>Agregar Pregunta</Text>
            </TouchableOpacity>
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
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        marginTop: 5,
        borderWidth: 1,
        borderColor: '#ddd',
        paddingHorizontal: 10
    },
    picker: {
        flex: 1
    },
    icon: {
        marginLeft: 10
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
        fontWeight: 'bold' },
    disabledButton: {
        backgroundColor: '#B0B0B0'
    },
});

export default AddQuestionScreen;
