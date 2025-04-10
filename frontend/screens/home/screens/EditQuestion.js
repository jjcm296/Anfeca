import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import FakeDatabase from '../../../fakeDataBase/FakeDataBase';
import CustomButton from '../../ui/components/CustomButton';
import CustomInput from '../../ui/components/CustomInput';
import {deleteQuestion, getQuestionById} from "../../../api/ApiQuestions";

const EditQuestion = ({ route, navigation }) => {
    const { questionId, bankId, name } = route.params;
    const [question, setQuestion] = useState('');
    const [answers, setAnswers] = useState(['', '', '', '']);
    const [difficulty, setDifficulty] = useState('1');

    useEffect(() => {
        const fetchQuestion = async () => {
            if (!questionId) {
                console.warn("No se recibió questionId en EditQuestion.");
                return;
            }

            console.log("Cargando pregunta con ID:", questionId);
            const questionData = getQuestionById(bankId, questionId);

            if (questionData) {
                setQuestion(questionData.questionText);
                setAnswers(questionData.answers || ["", "", "", ""]);
                setDifficulty(String(questionData.difficulty || '1'));
            } else {
                console.error("No se encontró la pregunta con ID:", questionId);
            }
        }
    }, [questionId]);

    const handleAnswerChange = (text, index) => {
        const newAnswers = [...answers];
        newAnswers[index] = text;
        setAnswers(newAnswers);
    };

    const handleUpdate = () => {
        if (question.trim() === '' || answers.some(ans => ans.trim() === '')) {
            Alert.alert("Error", "Todos los campos son obligatorios.");
            return;
        }

        FakeDatabase.updateQuestion(questionId, question, answers, difficulty);
        Alert.alert("Éxito", "Pregunta actualizada correctamente.");
        navigation.goBack();
    };

    const handleDelete = () => {
        Alert.alert(
            "Confirmar eliminación",
            "¿Estás seguro de que deseas eliminar esta pregunta?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        const deleted = deleteQuestion(bankId, questionId);
                        if (deleted) {
                            Alert.alert("Éxito", "Pregunta eliminada correctamente.");
                            navigation.goBack();
                        } else {
                            Alert.alert("Error", "No se encontró la pregunta.");
                        }
                    }
                }
            ]
        );
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Editar Pregunta</Text>

            <CustomInput
                placeholder="Editar pregunta..."
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
            <Picker
                selectedValue={String(difficulty)}
                onValueChange={(itemValue) => setDifficulty(String(itemValue))}
                style={styles.picker}
            >
                <Picker.Item label="1 Coin" value="1" />
                <Picker.Item label="2 Coins" value="2" />
                <Picker.Item label="3 Coins" value="3" />
            </Picker>

            <CustomButton
                color={'#FF0000'}
                text={"Eliminar"}
                textColor={'#FFFFFF'}
                onPress={handleDelete}
            />

            <CustomButton
                color={'#6200EE'}
                text="Aceptar"
                textColor={'#FFFFFF'}
                onPress={handleUpdate}
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
    picker: {
        marginTop: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd'
    }
});

export default EditQuestion;
