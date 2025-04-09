import React, { useState, useEffect , useCallback} from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import QuestionBankCard from "./components/QuestionBankCard";
import AddButton from "../ui/components/AddButton";
import WebButton from "./components/WebButton";
import {getAllBanks} from "../../api/ApiBank";
import {ApiRefreshAccessToken} from "../../api/ApiLogin";

const HomeScreen = ({ navigation }) => {
    const [questionBanks, setQuestionBanks] = useState([]);

    useEffect(() => {
        const fetchBanks = async () => {
            await ApiRefreshAccessToken();

            const banks = await getAllBanks();
            console.log("Nombres de los bancos:", banks.banksArray.map(bank => bank.name));
            setQuestionBanks(banks.banksArray);
        };

        fetchBanks();
    }, []);

    useFocusEffect(
        useCallback(() => {
            const fetchBanks = async () => {
                await ApiRefreshAccessToken();

                const banks = await getAllBanks();
                console.log("Nombres de los bancos:", banks.banksArray.map(bank => bank.name));
                setQuestionBanks(banks.banksArray);
            };

            fetchBanks();
        }, [])
    );


    return (
        <View style={styles.container}>
            {/* Lista de bancos de preguntas con número actualizado de preguntas */}
            <FlatList
                data={questionBanks}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Questions", { bankId: item._id, name: item.name })}
                        onLongPress={() => navigation.navigate("EditQuestionBank", { bankId: item._id })}
                    >
                        <QuestionBankCard category={item.name} questions={item.questions} />
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
                url={'https://concentra-tda-kavv6se6a-jjcm296s-projects.vercel.app'}
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