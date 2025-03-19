import React, { useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import QuestionCard from "../components/QuestionCard";
import AddButton from "../../ui/components/AddButton";
import FakeDataBase from '../../../fakeDataBase/FakeDataBase';

const Questions = ({ route, navigation }) => {
    const { category } = route.params;
    const [questions, setQuestions] = useState([]);

    // Función para cargar preguntas correctamente
    const loadQuestions = () => {
        const fetchedQuestions = FakeDataBase.getQuestionsByCategory(category);
        setQuestions([...fetchedQuestions]);
    };

    // Cargar preguntas cuando la pantalla se enfoque
    useFocusEffect(
        React.useCallback(() => {
            console.log(`Recargando preguntas para la categoría: ${category}`);
            loadQuestions();
        }, [category])
    );

    // Función para manejar la navegación
    const handlePress = (questionId) => {
        if (!questionId) {
            console.warn("Intento de navegación sin ID válido.");
            return;
        }

        console.log(`Navegando a EditQuestion con ID: ${questionId}, Categoría: ${category}`);

        // Usamos setTimeout para asegurar la ejecución inmediata de la navegación
        setTimeout(() => {
            navigation.navigate("EditQuestion", { category, questionId });
        }, 100);
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={questions}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => handlePress(item.id)}
                        activeOpacity={0.7}
                    >
                        <QuestionCard
                            questionNumber={item.questionNumber}
                            questionText={item.questionText}
                        />
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />

            {/* Botón para agregar preguntas dentro de Questions */}
            <AddButton onPress={() => navigation.navigate("AddQuestion", { category })} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContainer: {
        paddingVertical: 20,
        paddingHorizontal: 15,
        paddingBottom: 80,
    },
});

export default Questions;
