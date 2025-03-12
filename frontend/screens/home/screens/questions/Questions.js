import React from 'react';
import { View, FlatList, StatusBar, StyleSheet } from 'react-native';
import QuestionCard from "./components/QuestionCard";
import AddButton from "../../../ui/AddButton"; // Botón de agregar

const questionCard = [
    { questionNumber: 1, questionText: "¿Cuál es la capital de Francia?", onPress: "a" },
    { questionNumber: 2, questionText: "¿Cuál es la capital de España?", onPress: "b" },
    { questionNumber: 3, questionText: "¿Cuál es la capital de Italia?", onPress: "c" },
    { questionNumber: 4, questionText: "¿Cuál es la capital de Alemania?", onPress: "d" },
    { questionNumber: 5, questionText: "¿Cuál es la capital de Portugal?", onPress: "e" },
    { questionNumber: 6, questionText: "¿Cuál es la capital de Rusia?", onPress: "f" },
    { questionNumber: 7, questionText: "¿Cuál es la capital de China?", onPress: "g" },
    { questionNumber: 8, questionText: "¿Cuál es la capital de Japón?", onPress: "h" },
    { questionNumber: 9, questionText: "¿Cuál es la capital de Australia?", onPress: "i" },
    { questionNumber: 10, questionText: "¿Cuál es la capital de Argentina?", onPress: "j" },
];

const Questions = ({ route }) => {
    const { category, questions } = route.params; // Recibe los parámetros de navegación

    return (
        <View style={styles.container}>
            {/* Lista de preguntas */}
            <FlatList
                data={questionCard}
                keyExtractor={(item) => item.onPress}
                renderItem={({ item }) => (
                    <QuestionCard
                        questionNumber={item.questionNumber}
                        questionText={item.questionText}
                        onPress={() => {}}
                    />
                )}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />

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
    separator: {
        height: 5,
    },
});

export default Questions;
