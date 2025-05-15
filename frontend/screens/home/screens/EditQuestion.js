import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Dimensions
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getQuestionById } from "../../../api/ApiQuestions";
import { ApiEditQuestion } from "../../../api/ApiQuestions";
import { ApiRefreshAccessToken } from "../../../api/ApiLogin";
import CustomButton from '../../ui/components/CustomButton';
import CustomInput from '../../ui/components/CustomInput';
import { LinearGradient } from 'expo-linear-gradient';

const { height } = Dimensions.get('window');

const EditQuestion = ({ route, navigation }) => {
    const { questionId, bankId, name } = route.params;
    const [question, setQuestion] = useState('');
    const [answers, setAnswers] = useState(['', '', '', '']);
    const [difficulty, setDifficulty] = useState('1');

    useEffect(() => {
        const fetchQuestion = async () => {
            if (!questionId) return;
            try {
                await ApiRefreshAccessToken();
                const response = await getQuestionById(bankId, questionId);
                const questionData = response?.question;

                if (questionData) {
                    setQuestion(questionData.textQuestion || '');
                    const safeAnswers = (questionData.answers || []).map(a => a.textAnswer || '');
                    while (safeAnswers.length < 4) safeAnswers.push("");
                    setAnswers(safeAnswers);
                    setDifficulty(String(questionData.difficulty || '1'));
                } else {
                    Alert.alert("Error", "No se encontró la pregunta.");
                    navigation.goBack();
                }
            } catch {
                Alert.alert("Error", "No se pudo cargar la pregunta.");
                navigation.goBack();
            }
        };
        fetchQuestion();
    }, [questionId]);

    const handleAnswerChange = (text, index) => {
        const newAnswers = [...answers];
        newAnswers[index] = text;
        setAnswers(newAnswers);
    };

    const handleUpdate = async () => {
        const questionData = {
            textQuestion: question.trim(),
            answers: answers.map((text, index) => ({
                textAnswer: text.trim(),
                isCorrect: index === 0,
            })),
            priority: Number(difficulty),
        };

        try {
            await ApiRefreshAccessToken();
            const result = await ApiEditQuestion(bankId, questionId, questionData);
            if (result && !result.error) {
                Alert.alert("Éxito", "Pregunta actualizada correctamente.");
                navigation.navigate("Questions", { bankId, refresh: true });
            } else {
                Alert.alert("Error", result?.error || "No se pudo actualizar la pregunta.");
            }
        } catch {
            Alert.alert("Error", "Ocurrió un error inesperado al actualizar.");
        }
    };

    const handleCancel = () => {
        navigation.goBack();
    };

    const isFormIncomplete = () =>
        !question.trim() ||
        answers.some(answer => !answer.trim());


    return (
        <LinearGradient colors={['#2faaf6', '#ffffff']} style={styles.gradient}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scroll}>
                    <View style={styles.card}>
                        <Text style={styles.title}>✏️ Editar Pregunta</Text>

                        <CustomInput
                            placeholder="Texto de la pregunta"
                            value={question}
                            onChangeText={setQuestion}
                            required
                        />

                        <Text style={styles.label}>Respuesta Correcta</Text>
                        <CustomInput
                            placeholder="Respuesta Correcta"
                            value={answers[0]}
                            onChangeText={(text) => handleAnswerChange(text, 0)}
                            required
                            customStyle={styles.correctAnswer}
                        />

                        <Text style={styles.label}>Respuestas Incorrectas</Text>
                        {answers.slice(1).map((answer, index) => (
                            <CustomInput
                                key={index}
                                placeholder={`Respuesta Incorrecta ${index + 1}`}
                                value={answer}
                                onChangeText={(text) => handleAnswerChange(text, index + 1)}
                                required
                                customStyle={styles.incorrectAnswer}
                            />
                        ))}

                        <Text style={styles.label}>Dificultad</Text>
                        <View style={styles.pickerWrapper}>
                            <Picker
                                selectedValue={difficulty}
                                onValueChange={(value) => setDifficulty(value)}
                                style={styles.picker}
                            >
                                <Picker.Item label="1 Moneda" value="1" />
                                <Picker.Item label="2 Monedas" value="2" />
                                <Picker.Item label="3 Monedas" value="3" />
                            </Picker>
                        </View>

                        <View style={styles.buttons}>
                            <CustomButton
                                color="#3E9697"
                                text="Actualizar pregunta"
                                textColor="#FFFFFF"
                                onPress={handleUpdate}
                                disabled={isFormIncomplete()}
                            />
                            <CustomButton
                                color="#B3E5FC"
                                text="Cancelar"
                                textColor="#003F5C"
                                onPress={handleCancel}
                            />
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    scroll: {
        flexGrow: 1,
        padding: 20,
        justifyContent: "center",
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        minHeight: height * 0.80,
        justifyContent: 'flex-start',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
        borderWidth: 1.5,
        borderColor: '#2f5c98',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 18,
        marginBottom: 5,
        color: '#333',
    },
    correctAnswer: {
        backgroundColor: '#E6FFE6',
        borderColor: '#4CAF50',
    },
    incorrectAnswer: {
        backgroundColor: '#FFE6E6',
        borderColor: '#E53935',
    },
    pickerWrapper: {
        backgroundColor: '#f4f4f4',
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: '#3E9697',
        overflow: 'hidden',
        marginBottom: 25,
    },
    picker: {
        height: 48,
        paddingHorizontal: 10,
    },
});

export default EditQuestion;
