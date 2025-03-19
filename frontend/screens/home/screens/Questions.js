import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import QuestionCard from "../components/QuestionCard";
import AddButton from "../../ui/components/AddButton";
import FakeDataBase from '../../../fakeDataBase/FakeDataBase';

const Questions = ({ route, navigation }) => {
    const { category } = route.params; // Recibe la categoría desde HomeScreen
    const [questions, setQuestions] = useState([]);

    // Cargar las preguntas de la categoría seleccionada
    useEffect(() => {
        setQuestions(FakeDataBase.getQuestionsByCategory(category));
    }, [category]);

    return (
        <View style={styles.container}>
            {/* 🔹 Lista de preguntas de la categoría seleccionada */}
            <FlatList
                data={questions}
                keyExtractor={(item) => item.id}
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

            {/* 🔹 Botón independiente para agregar preguntas dentro de Questions */}
            <AddButton onPress={() => navigation.navigate("AddQuestion", { category })} />
        </View>
    );
};

// 🔹 Estilos
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
