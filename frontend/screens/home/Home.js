import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import QuestionBankCard from "./components/QuestionBankCard";
import AddButton from "../ui/components/AddButton";
import WebButton from "./components/WebButton";
import SkeletonQuestionBankCard from "./components/skeletons/SkeletonQuestionBankCard";
import GameSelectorModal from "./screens/kid/GameSelector";

import { getAllBanks } from "../../api/ApiBank";
import { ApiRefreshAccessToken } from "../../api/ApiLogin";
import { SessionContext } from "../../context/SessionContext";

const HomeScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [questionBanks, setQuestionBanks] = useState([]);

    const [selectorVisible, setSelectorVisible] = useState(false);
    const [selectedBank, setSelectedBank] = useState(null);

    const { session } = useContext(SessionContext);

    useEffect(() => {
        const fetchBanks = async () => {
            setLoading(true);
            await ApiRefreshAccessToken();
            const banks = await getAllBanks();
            setQuestionBanks(banks.banksArray);
            setLoading(false);
        };

        fetchBanks();
    }, []);

    useFocusEffect(
        useCallback(() => {
            const fetchBanks = async () => {
                await ApiRefreshAccessToken();
                const banks = await getAllBanks();
                setQuestionBanks(banks.banksArray);
            };

            fetchBanks();
        }, [])
    );

    const handleBankPress = (item) => {
        if (session.profileType === 'guardian') {
            navigation.navigate("Questions", { bankId: item._id, name: item.name });
        } else if (session.profileType === 'kid') {
            setSelectedBank(item);
            setSelectorVisible(true);
        }
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.listContainer}>
                    {[1, 2, 3, 4, 5].map((_, index) => (
                        <SkeletonQuestionBankCard key={index} />
                    ))}
                </View>
            ) : (
                <FlatList
                    data={questionBanks}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => handleBankPress(item)}
                            onLongPress={() =>
                                session.profileType === 'guardian' &&
                                navigation.navigate("EditQuestionBank", { bankId: item._id })
                            }
                            disabled={session.profileType !== 'guardian' && session.profileType !== 'kid'}
                        >
                            <QuestionBankCard category={item.name} questions={item.questions} />
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={styles.listContainer}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    showsVerticalScrollIndicator={false}
                />
            )}

            {session.profileType === 'guardian' && (
                <AddButton onPress={() => navigation.navigate("AddQuestionBank")} />
            )}

            <WebButton
                imageSource={require('../../images/Logo-png.png')}
                url={'https://concentra-tda-kavv6se6a-jjcm296s-projects.vercel.app'}
            />

            <GameSelectorModal
                visible={selectorVisible}
                onClose={() => setSelectorVisible(false)}
                onSelectMode={(mode) => {
                    setSelectorVisible(false);
                    if (!selectedBank) return;
                    if (mode === 'cards') {
                        navigation.navigate('FlashcardsGame', { bankId: selectedBank._id, name: selectedBank.name });
                    } else {
                        navigation.navigate('MiniGame', { bankId: selectedBank._id, name: selectedBank.name });
                    }
                }}
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
