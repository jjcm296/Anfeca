import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import QuestionBankCard from "./components/QuestionBankCard";
import AddButton from "../ui/components/AddButton";
import FakeDataBase from '../../fakeDataBase/FakeDataBase';
import WebButton from "./components/WebButton";

function RewardsStack() {
    return (
        <View style={{ flex: 1 }}>
            <TopBar coins={100} streak={5} />
            <RewardsScreen />
        </View>
    );
}

const HomeScreen = ({ navigation }) => {
    const [questionBanks, setQuestionBanks] = useState([]);

    // Cargar los bancos de preguntas y contar la cantidad de preguntas en cada uno
    useEffect(() => {
        const banks = FakeDataBase.getQuestionBanks().map(bank => ({
            ...bank,
            questions: FakeDataBase.getQuestionsByCategory(bank.category).length
        }));
        setQuestionBanks(banks);
    }, []);

    // Si el usuario presiona Home en la barra de navegación, vuelve a los bancos de preguntas
    useFocusEffect(
        React.useCallback(() => {
            const banks = FakeDataBase.getQuestionBanks().map(bank => ({
                ...bank,
                questions: FakeDataBase.getQuestionsByCategory(bank.category).length
            }));
            setQuestionBanks(banks);
        }, [])
    );

    return (
        <View style={styles.container}>
            {/* Lista de bancos de preguntas con número actualizado de preguntas */}
            <FlatList
                data={questionBanks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Questions", { category: item.category })}
                        onLongPress={() => navigation.navigate("EditQuestionBank", { bankId: item.id })} // 🔹 Agregado: Mantener presionado para editar
                    >
                        <QuestionBankCard category={item.category} questions={item.questions} />
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.listContainer}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                showsVerticalScrollIndicator={false}
            />

            {/* Botón independiente para HomeScreen */}
            <AddButton onPress={() => navigation.navigate("AddQuestionBank")} />

            <WebButton
                imageSource={require('../../images/Logo-png.png')}
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

export default HomeScreen;
