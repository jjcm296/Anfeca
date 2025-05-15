import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    FlatList,
    ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute } from '@react-navigation/native';
import { ApiGetPremiumBankById, ApiGetPremiumBankQuestions } from '../../../api/ApiPremium';

const BankDetail = () => {
    const route = useRoute();
    const { bankId } = route.params;

    const [bank, setBank] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const bankRes = await ApiGetPremiumBankById(bankId);
            const questionsRes = await ApiGetPremiumBankQuestions(bankId);

            if (bankRes?.bank) setBank(bankRes.bank);
            if (questionsRes?.questions) setQuestions(questionsRes.questions);

            setLoading(false);
        };

        fetchData();
    }, [bankId]);

    if (loading) {
        return (
            <LinearGradient colors={['#2faaf6', '#ffffff']} style={styles.gradient}>
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color="#2f5c98" />
                </View>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient colors={['#2faaf6', '#ffffff']} style={styles.gradient}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>{bank?.name || 'Banco Premium'}</Text>

                <Text style={styles.subtitle}>
                    {questions.length} pregunta{questions.length !== 1 && 's'} disponibles
                </Text>

                <FlatList
                    data={questions}
                    keyExtractor={(item) => item._id}
                    scrollEnabled={false}
                    contentContainerStyle={{ gap: 12 }}
                    renderItem={({ item, index }) => (
                        <View style={styles.questionCard}>
                            <Text style={styles.questionNumber}>Pregunta {index + 1}</Text>
                            <Text style={styles.questionText}>{item.textQuestion}</Text>
                        </View>
                    )}
                />
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    container: {
        padding: 20,
        paddingBottom: 40,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2f5c98',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#444',
        textAlign: 'center',
        marginBottom: 20,
    },
    questionCard: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 16,
        borderWidth: 1.5,
        borderColor: '#2f5c98',
    },
    questionNumber: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2f5c98',
        marginBottom: 6,
    },
    questionText: {
        fontSize: 16,
        color: '#333',
    },
});

export default BankDetail;
