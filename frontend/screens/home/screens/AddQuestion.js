import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import FakeDatabase from '../../../fakeDataBase/FakeDataBase';
import CustomButton from '../../ui/components/CustomButton'; // Botón reutilizable
import CoinIcon from '../../ui/components/CoinIcon'; // Icono de moneda reutilizable
import CustomInput from '../../ui/components/CustomInput'; // Nuevo Input

const AddQuestion = ({ route, navigation }) => {
    const { category } = route.params || {}; // Asegurar que category existe
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
            <Text style={styles.title}>
                Agregar Pregunta a <Text style={styles.categoryText}>{category ? String(category) : 'Sin Categoría'}</Text>
            </Text>

            {/* Campo para ingresar la pregunta con `CustomInput` */}
            <CustomInput
                placeholder="Escribe la pregunta..."
                value={question ? String(question) : ''}
                onChangeText={setQuestion}
                required={true}
            />

            {/* Respuesta correcta */}
            <Text style={styles.correctLabel}>Respuesta Correcta:</Text>
            <CustomInput
                placeholder="Respuesta Correcta"
                value={answers[0] ? String(answers[0]) : ''}
                onChangeText={(text) => handleAnswerChange(text, 0)}
                required={true}
                customStyle={styles.correctAnswer}
            />

            {/* Respuestas incorrectas */}
            <Text style={styles.incorrectLabel}>Respuestas Incorrectas:</Text>
            {answers.slice(1).map((answer, index) => (
                <CustomInput
                    key={index + 1}
                    placeholder={`Respuesta Incorrecta ${index + 1}`}
                    value={answer ? String(answer) : ''}
                    onChangeText={(text) => handleAnswerChange(text, index + 1)}
                    required={true}
                    customStyle={styles.incorrectAnswer}
                />
            ))}

            {/* Selector de dificultad */}
            <Text style={styles.label}>Selecciona Dificultad:</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={String(difficulty)} // Convertimos a string para evitar errores
                    onValueChange={(itemValue) => setDifficulty(String(itemValue))}
                    style={styles.picker}
                >
                    <Picker.Item label="1 Coin" value="1" />
                    <Picker.Item label="2 Coins" value="2" />
                    <Picker.Item label="3 Coins" value="3" />
                </Picker>
                <CoinIcon size={30} /> {/* Icono de moneda reutilizable */}
            </View>

            {/* Botón reutilizable */}
            <CustomButton
                color="#6200EE"
                text="Agregar Pregunta"
                onPress={handleSubmit}
                disabled={question.trim() === '' || answers.some(ans => ans.trim() === '')}
            />
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
    categoryText: {
        fontWeight: 'bold',
        color: '#6200EE'
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10
    },
    correctLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'green',
        marginTop: 15
    },
    incorrectLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'red',
        marginTop: 15
    },
    correctAnswer: {
        backgroundColor: '#DFFFD6', // Verde claro para indicar respuesta correcta
        borderColor: 'green',
    },
    incorrectAnswer: {
        backgroundColor: '#FFD6D6', // Rojo claro para indicar respuestas incorrectas
        borderColor: 'red',
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
});

export default AddQuestion;
