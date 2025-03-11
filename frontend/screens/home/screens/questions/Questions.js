import React from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar } from 'react-native';
import CoinsDisplay from '../../../stats/CoinsDisplay'; // Componente de monedas
import StreakDisplay from '../../../stats/StreakDisplay'; // Componente de racha
import QuestionCard from "./components/QuestionCard"; // Componente de tarjeta de preguntas

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
            {/* Contenedor superior para monedas y racha */}
            <View style={styles.topBar}>
                <CoinsDisplay coins={100} />
                <StreakDisplay streak={5} />
            </View>

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
    topBar: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginTop: StatusBar.currentHeight || 10,
        shadowOffset: { width: 0, height: 2 },
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
