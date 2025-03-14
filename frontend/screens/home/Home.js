import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import QuestionBankCard from "./components/QuestionBankCard";
import AddButton from "../ui/components/AddButton";
import FakeDataBase from '../../fakeDataBase/FakeDataBase';

const HomeScreen = ({ navigation }) => {
    const [questionBanks, setQuestionBanks] = useState([]);

    // Cargar los bancos de preguntas desde la FakeDataBase
    useEffect(() => {
        setQuestionBanks(FakeDataBase.getQuestionBanks());
    }, []);

    // Si el usuario presiona Home en la barra de navegación, vuelve a los bancos de preguntas
    useFocusEffect(
        React.useCallback(() => {
            setQuestionBanks(FakeDataBase.getQuestionBanks());
        }, [])
    );

    return (
        <View style={styles.container}>
            {/* 🔹 Lista de bancos de preguntas */}
            <FlatList
                data={questionBanks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate("Questions", { category: item.category })}>
                        <QuestionBankCard category={item.category} questions={item.questions} />
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.listContainer}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                showsVerticalScrollIndicator={false}
            />

            {/* 🔹 Botón independiente para HomeScreen */}
            <AddButton/>
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
    separator: {
        height: 5,
    },
});

export default HomeScreen;
