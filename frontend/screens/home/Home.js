import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, FlatList, TouchableWithoutFeedback } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import CoinsDisplay from '../ui/CoinsDisplay'; // Monedas
import StreakDisplay from '../ui/StreakDisplay'; // Racha
import QuestionBankCard from "./components/QuestionBankCard"; // Tarjetas de categorías
import QuestionCard from "./screens/questions/components/QuestionCard"; // Tarjetas de preguntas

const questionBanks = [
    { id: '1', category: 'Matemáticas', questions: 5 },
    { id: '2', category: 'Ciencias', questions: 8 },
    { id: '3', category: 'Historia', questions: 10 },
    { id: '4', category: 'Geografía', questions: 6 },
    { id: '5', category: 'Deportes', questions: 3 },
];

const questionsList = {
    Matemáticas: [
        { id: '1', questionNumber: 1, questionText: "¿Cuánto es 2+2?" },
        { id: '2', questionNumber: 2, questionText: "¿Cuánto es 5x3?" },
    ],
    Ciencias: [
        { id: '1', questionNumber: 1, questionText: "¿Cuál es la fórmula del agua?" },
        { id: '2', questionNumber: 2, questionText: "¿Qué planeta es el más grande?" },
    ],
    Historia: [
        { id: '1', questionNumber: 1, questionText: "¿Quién descubrió América?" },
        { id: '2', questionNumber: 2, questionText: "¿En qué año fue la Revolución Francesa?" },
    ],
};

const HomeScreen = ({ navigation }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);

    // 🚀 Restablece la categoría cuando el usuario regresa a Home
    useFocusEffect(
        React.useCallback(() => {
            setSelectedCategory(null);
        }, [])
    );

    // ✅ Restablecer la vista principal cuando se presiona "Home" en la barra de navegación
    useEffect(() => {
        const unsubscribe = navigation.addListener('tabPress', (e) => {
            setSelectedCategory(null); // Se asegura de que siempre regrese a las tarjetas
        });

        return unsubscribe;
    }, [navigation]);

    return (
        <View style={styles.container}>
            {/* Contenedor superior para monedas y racha (Siempre visible) */}
            <View style={styles.topBar}>
                <CoinsDisplay coins={100} />
                <StreakDisplay streak={5} />
            </View>

            {/* Mostrar lista de tarjetas o preguntas según el estado */}
            {selectedCategory === null ? (
                <FlatList
                    data={questionBanks}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableWithoutFeedback onPress={() => setSelectedCategory(item.category)}>
                            <View>
                                <QuestionBankCard category={item.category} questions={item.questions} />
                            </View>
                        </TouchableWithoutFeedback>
                    )}
                    contentContainerStyle={styles.listContainer}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <FlatList
                    data={questionsList[selectedCategory] || []}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <QuestionCard
                            questionNumber={item.questionNumber}
                            questionText={item.questionText}
                            onPress={() => {}}
                        />
                    )}
                    contentContainerStyle={styles.listContainer}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    showsVerticalScrollIndicator={false}
                />
            )}
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

export default HomeScreen;
