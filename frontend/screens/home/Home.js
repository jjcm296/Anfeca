import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import QuestionBankCard from "./components/QuestionBankCard";
import AddButton from "../ui/components/AddButton";
import WebButton from "./components/WebButton";
import SkeletonQuestionBankCard from "./components/skeletons/SkeletonQuestionBankCard";
import { getAllBanks } from "../../api/ApiBank";
import { ApiRefreshAccessToken } from "../../api/ApiLogin";
import { SessionContext } from "../../context/SessionContext";

const HomeScreen = () => {
    const [loading, setLoading] = useState(true);
    const [questionBanks, setQuestionBanks] = useState([]);
    const { session } = useContext(SessionContext);
    const navigation = useNavigation();

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
            navigation.navigate("Questions", { bankId: item._id });
        } else if (session.profileType === 'kid') {
            navigation.navigate("GameSelector", {
                bankId: item._id,
                bankName: item.name,
            });
        }
    };

    const handleLongPress = (item) => {
        if (session.profileType === 'guardian') {
            navigation.navigate("EditQuestionBank", { bankId: item._id });
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
                            onLongPress={() => handleLongPress(item)}
                        >
                            <QuestionBankCard category={item.name} questions={item.questions} />
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={styles.listContainer}
                />
            )}

            {session.profileType === 'guardian' && (
                <AddButton onPress={() => navigation.navigate("AddQuestionBank")} />
            )}

            <WebButton
                imageSource={require('../../assets/logo/Logo .png')}
                url={'https://concentra-tda-kqrwj8g59-jjcm296s-projects.vercel.app'}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    listContainer: {
        paddingVertical: 20,
        paddingHorizontal: 15,
        paddingBottom: 80,
    },
});

export default HomeScreen;
