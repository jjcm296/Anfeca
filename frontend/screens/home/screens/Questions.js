import React, {useCallback, useContext, useEffect, useState} from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import QuestionCard from "../components/QuestionCard";
import AddButton from "../../ui/components/AddButton";
import { ApiRefreshAccessToken } from "../../../api/ApiLogin";
import { getAllQuestions } from "../../../api/ApiQuestions";
import SkeletonQuestionCard from "../components/skeletons/SkeletonQuestionCard";
import {SessionContext} from "../../../context/SessionContext";

const Questions = ({ route, navigation }) => {
    const { bankId, name } = route.params;
    
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasLoaded, setHasLoaded] = useState(false);

    const { session } = useContext(SessionContext);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            await ApiRefreshAccessToken();
            const response = await getAllQuestions(bankId);
            if (response.questions) {
                setQuestions(response.questions);
                setHasLoaded(true); // 🟢 marcamos como cargado
            }
            setLoading(false);
        } catch (error) {
            console.error("Error al obtener preguntas:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchQuestions();
        }, [])
    );

    return (
        <View style={styles.container}>
            {loading && !hasLoaded ? (
                <View style={styles.listContainer}>
                    {[1, 2, 3, 4, 5].map((_, index) => (
                        <SkeletonQuestionCard key={index} />
                    ))}
                </View>
            ) : (
                <FlatList
                    data={questions}
                    keyExtractor={(item) => item._id || item.id}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() =>
                                navigation.navigate("EditQuestion", {
                                    questionId: item._id || item.id,
                                    bankId,
                                    name,
                                })
                            }
                        >
                            <QuestionCard
                                questionNumber={index + 1}
                                questionText={item.textQuestion}
                            />
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            )}
            {session.profileType === 'guardian' && (
                <AddButton onPress={() => navigation.navigate("AddQuestion", { bankId, name })} />
            )}
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
