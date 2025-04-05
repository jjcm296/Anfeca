import React, { useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import QuestionCard from "../components/QuestionCard";
import AddButton from "../../ui/components/AddButton";
import FakeDataBase from '../../../fakeDataBase/FakeDataBase';

const Questions = ({ route, navigation }) => {
    const { category } = route.params;
    const [questions, setQuestions] = useState([]);

    // Cargar preguntas cuando la pantalla se enfoque
    useFocusEffect(
        React.useCallback(() => {
            console.log(`Recargando preguntas para la categoría: ${category}`);
            setQuestions([...FakeDataBase.getQuestionsByCategory(category)]);
        }, [category])
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={questions}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate("EditQuestion", { questionId: item.id })}
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
