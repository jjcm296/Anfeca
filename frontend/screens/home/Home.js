import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import QuestionBankCard from "./components/QuestionBankCard";
import AddButton from "../ui/components/AddButton";
import WebButton from "./components/WebButton";
import SkeletonQuestionBankCard from "./components/skeletons/SkeletonQuestionBankCard";
import {ApiStartStudySession, getAllBanks} from "../../api/ApiBank";
import { ApiRefreshAccessToken } from "../../api/ApiLogin";
import { SessionContext } from "../../context/SessionContext";

const HomeScreen = () => {
    const [loading, setLoading] = useState(true);
    const [questionBanks, setQuestionBanks] = useState([]);
    const { session } = useContext(SessionContext);
    const navigation = useNavigation();

    const fetchBanks = async () => {
        setLoading(true);
        await ApiRefreshAccessToken();
        const banks = await getAllBanks();

        const banksWithSessionState = await Promise.all(
            banks.banksArray.map(async (bank) => {
                try {
                    const res = await ApiStartStudySession(bank._id);

                    if (res?.firstFlashcard && res?.sessionId) {
                        return {
                            ...bank,
                            canStudy: true,
                            canPlayMiniGame: false,
                            studySessionId: res.sessionId,
                        };
                    } else if (res?.error === "One game session for this bank already exists") {
                        return {
                            ...bank,
                            canStudy: false,
                            canPlayMiniGame: true,
                            studySessionId: null,
                        };
                    } else {
                        return {
                            ...bank,
                            canStudy: false,
                            canPlayMiniGame: false,
                            studySessionId: null,
                        };
                    }
                } catch (error) {
                    return {
                        ...bank,
                        canStudy: false,
                        canPlayMiniGame: false,
                        studySessionId: null,
                    };
                }
            })
        );

        setQuestionBanks(banksWithSessionState);
        setLoading(false);
    };

    useEffect(() => {
        fetchBanks();
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchBanks();
        }, [])
    );

    useEffect(() => {
        fetchBanks();
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchBanks();
        }, [])
    );


    const handleBankPress = (item) => {
        navigation.navigate("Questions", { bankId: item._id });
    };

    const handleBankDeleted = (deletedBankId) => {
        setTimeout(() => {
            setQuestionBanks(prev => prev.filter(bank => bank._id !== deletedBankId));
        }, 800);
    };

    return (
        <LinearGradient colors={['#2faaf6', '#ffffff']} style={styles.container}>
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
                    renderItem={({ item }) => {
                        const commonProps = {
                            category: item.name,
                            questions: item.questions,
                            profileType: session.profileType,
                            bankId: item._id,
                            bankName: item.name,
                            canStudy: item.canStudy,
                            canPlayMiniGame: item.canPlayMiniGame,
                            studySessionId: item.studySessionId,
                            onBankDeleted: handleBankDeleted,
                        };

                        if (session.profileType === 'guardian') {
                            return (
                                <TouchableOpacity
                                    onPress={() => handleBankPress(item)}
                                >
                                    <QuestionBankCard
                                        category={item.name}
                                        questions={item.questions}
                                        profileType={session.profileType}
                                        bankId={item._id}
                                        bankName={item.name}
                                        canStudy={item.canStudy}
                                        canPlayMiniGame={item.canPlayMiniGame}
                                        studySessionId={item.studySessionId}
                                        onBankDeleted={handleBankDeleted}
                                    />

                                </TouchableOpacity>
                            );
                        }

                        return <QuestionBankCard {...commonProps} />;
                    }}
                    contentContainerStyle={styles.listContainer}
                />
            )}

            {session.profileType === 'guardian' && (
                <AddButton onPress={() => navigation.navigate("AddQuestionBank")} />
            )}

            <WebButton
                imageSource={require('../../assets/mascota/frente.png')}
                url={'https://concentra-tda-web.vercel.app'}
            />
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContainer: {
        paddingVertical: 20,
        paddingHorizontal: 5,
        paddingBottom: 80,
    },
});

export default HomeScreen;