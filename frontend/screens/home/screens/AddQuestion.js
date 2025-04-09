import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import FakeDatabase from '../../../fakeDataBase/FakeDataBase';
import CustomButton from '../../ui/components/CustomButton';
import CoinIcon from '../../ui/components/CoinIcon';
import CustomInput from '../../ui/components/CustomInput';
import {ApiRefreshAccessToken} from "../../../api/ApiLogin";
import {createQuestion} from "../../../api/ApiQuestions";

const AddQuestion = ({ route, navigation }) => {
    const { bankId, name } = route.params;

    const [question, setQuestion] = useState('');
    const [answers, setAnswers] = useState(['', '', '', '']);
    const [difficulty, setDifficulty] = useState('1');

    const handleAnswerChange = (text, index) => {
        const newAnswers = [...answers];
        newAnswers[index] = text;
        setAnswers(newAnswers);
    };

    const handleSubmit = async () => {
        const trimmedAnswers = answers.map(a => a.trim());

        // Validar campos vacíos
        if (question.trim() === '' || trimmedAnswers.some(ans => ans === '')) {
            Alert.alert("Error", "Todos los campos son obligatorios.");
            return;
        }

        // Validar cantidad mínima de respuestas: 1 correcta y 1 incorrecta
        const hasCorrect = trimmedAnswers[0] !== '';
        const incorrectCount = trimmedAnswers.slice(1).filter(ans => ans !== '').length;

        if (!hasCorrect || incorrectCount < 1) {
            Alert.alert("Error", "Debe haber al menos una respuesta correcta y una incorrecta.");
            return;
        }

        // Construir respuestas como arreglo (no como objeto con índices)
        const finalAnswers = [];

        trimmedAnswers.forEach((ans, index) => {
            if (ans !== '') {
                finalAnswers.push({
                    textAnswer: ans,
                    isCorrect: index === 0,
                });
            }
        });

        const body = {
            textQuestion: question.trim(),
            answers: finalAnswers,
            priority: difficulty,
        };

        try {
            await ApiRefreshAccessToken();

            const response = await createQuestion(body, bankId);
            if (response.error) {
                console.log("Error:", response.error);
                Alert.alert("Error", "Error al agregar la pregunta.");
                return;
            }

            console.log("Respuesta:", response);
            Alert.alert("Éxito", "Pregunta agregada correctamente.");
            navigation.goBack();

        } catch (error) {
            console.error("Error inesperado:", error);
            Alert.alert("Error", "Error al agregar la pregunta.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Agregar Pregunta a <Text style={styles.categoryText}>{String(name) || 'Sin Categoría'}</Text>
            </Text>

            <CustomInput
                placeholder="Escribe la pregunta..."
                value={String(question)}
                onChangeText={setQuestion}
                required={true}
            />

            <Text style={styles.correctLabel}>Respuesta Correcta:</Text>
            <CustomInput
                placeholder="Respuesta Correcta"
                value={String(answers[0])}
                onChangeText={(text) => handleAnswerChange(text, 0)}
                required={true}
                customStyle={styles.correctAnswer}
            />

            <Text style={styles.incorrectLabel}>Respuestas Incorrectas:</Text>
            {answers.slice(1).map((answer, index) => (
                <CustomInput
                    key={index + 1}
                    placeholder={`Respuesta Incorrecta ${index + 1}`}
                    value={String(answer)}
                    onChangeText={(text) => handleAnswerChange(text, index + 1)}
                    required={true}
                    customStyle={styles.incorrectAnswer}
                />
            ))}

            <Text style={styles.label}>Selecciona Dificultad:</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={String(difficulty)}
                    onValueChange={(itemValue) => setDifficulty(String(itemValue))}
                    style={styles.picker}
                >
                    <Picker.Item label="1 Coin" value="1" />
                    <Picker.Item label="2 Coins" value="2" />
                    <Picker.Item label="3 Coins" value="3" />
                </Picker>
                <CoinIcon size={30} />
            </View>

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
        backgroundColor: '#DFFFD6',
        borderColor: 'green',
    },
    incorrectAnswer: {
        backgroundColor: '#FFD6D6',
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
