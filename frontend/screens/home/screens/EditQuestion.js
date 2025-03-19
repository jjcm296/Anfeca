import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import FakeDataBase from '../../../fakeDataBase/FakeDataBase';
import CustomButton from '../../ui/components/CustomButton';
import CustomInput from '../../ui/components/CustomInput';

const EditQuestion = ({ route, navigation }) => {
    const { category, questionId } = route.params || {};

    const [question, setQuestion] = useState('');
    const [answers, setAnswers] = useState(['', '', '', '']);

    useEffect(() => {
        const fetchQuestion = () => {
            if (!questionId) {
                console.warn("⚠ No se recibió questionId en EditQuestion.");
                return;
            }
            console.log("🔍 Cargando pregunta con ID:", questionId);

            const questionData = FakeDataBase.getQuestionById(category, questionId);
            if (questionData) {
                setQuestion(questionData.questionText);
                setAnswers(questionData.answers || ["", "", "", ""]);
            } else {
                console.error("❌ No se encontró la pregunta con ID:", questionId);
            }
        };

        fetchQuestion();
    }, [category, questionId]);

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

        FakeDataBase.updateQuestion(category, questionId, question, answers);
        Alert.alert("Éxito", "Pregunta actualizada correctamente.");
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Editar Pregunta en <Text style={styles.categoryText}>{category}</Text>
            </Text>

            <CustomInput
                placeholder="Editar pregunta..."
                value={question}
                onChangeText={setQuestion}
                required={true}
            />

            <Text style={styles.correctLabel}>Respuesta Correcta:</Text>
            <CustomInput
                placeholder="Respuesta Correcta"
                value={answers[0]}
                onChangeText={(text) => handleAnswerChange(text, 0)}
                required={true}
                customStyle={styles.correctAnswer}
            />

            <Text style={styles.incorrectLabel}>Respuestas Incorrectas:</Text>
            {answers.slice(1).map((answer, index) => (
                <CustomInput
                    key={index + 1}
                    placeholder={`Respuesta Incorrecta ${index + 1}`}
                    value={answer}
                    onChangeText={(text) => handleAnswerChange(text, index + 1)}
                    required={true}
                    customStyle={styles.incorrectAnswer}
                />
            ))}

            <CustomButton color="#6200EE" text="Actualizar Pregunta" onPress={handleUpdate} />
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
});

export default EditQuestion;
