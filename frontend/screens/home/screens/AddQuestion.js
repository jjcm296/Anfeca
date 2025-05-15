import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import CoinIcon from '../../ui/components/CoinIcon';
import CustomButton from '../../ui/components/CustomButton';
import CustomInput from '../../ui/components/CustomInput';
import { ApiRefreshAccessToken } from '../../../api/ApiLogin';
import { createQuestion } from '../../../api/ApiQuestions';

const { height } = Dimensions.get('window');

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

    const isFormIncomplete = () =>
        !question.trim() ||
        answers.some(answer => !answer.trim());

    const handleSubmit = async () => {
        const trimmedAnswers = answers.map(a => a.trim());

        if (isFormIncomplete()) {
            Alert.alert("Error", "Todos los campos son obligatorios.");
            return;
        }

        const hasCorrect = trimmedAnswers[0] !== '';
        const incorrectCount = trimmedAnswers.slice(1).filter(ans => ans !== '').length;

        if (!hasCorrect || incorrectCount < 1) {
            Alert.alert("Error", "Debe haber al menos una respuesta correcta y una incorrecta.");
            return;
        }

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
                Alert.alert("Error", "Error al agregar la pregunta.");
                return;
            }

            Alert.alert("Éxito", "Pregunta agregada correctamente.");
            navigation.goBack();
        } catch (error) {
            Alert.alert("Error", "Error al agregar la pregunta.");
        }
    };

    const handleCancel = () => {
        navigation.goBack();
    };

    return (
        <LinearGradient colors={['#2faaf6', '#ffffff']} style={styles.gradient}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scroll}>
                    <View style={styles.card}>
                        <Text style={styles.title}>Agregar Pregunta</Text>

                        <CustomInput
                            placeholder="Escribe la pregunta..."
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
                            <CoinIcon size={30} />
                        </View>

                        <View style={styles.buttons}>
                            <CustomButton
                                color="#3E9697"
                                text="Agregar Pregunta"
                                textColor="#FFFFFF"
                                onPress={handleSubmit}
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
        justifyContent: 'center',
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
    categoryText: {
        fontWeight: 'bold',
        color: '#6200EE'
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
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f4f4f4',
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: '#3E9697',
        overflow: 'hidden',
        marginBottom: 25,
        paddingHorizontal: 10,
    },
    picker: {
        flex: 1,
        height: 48,
    },
    buttons: {
        marginTop: 10,
    },
});

export default AddQuestion;