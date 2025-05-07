import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const sampleQuestions = [
    { question: '2 + 2', answer: '4' },
    { question: '5 - 3', answer: '2' },
    { question: '3 × 3', answer: '9' },
    { question: '10 ÷ 2', answer: '5' },
];

const ratings = [
    { label: 'Muy difícil', icon: 'sad-outline', color: '#FF3B30' },
    { label: 'Difícil', icon: 'alert-circle-outline', color: '#FF9500' },
    { label: 'Bien', icon: 'happy-outline', color: '#34C759' },
    { label: 'Muy bien', icon: 'thumbs-up-outline', color: '#0A84FF' },
];

const FlashCardGame = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { bankName = 'Banco' } = route.params || {};

    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);

    const current = sampleQuestions[currentIndex];

    const handleRate = () => {
        setShowAnswer(false);
        if (currentIndex < sampleQuestions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            navigation.goBack(); // o un mensaje de fin
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{bankName}</Text>

            <View style={styles.card}>
                <Text style={styles.question}>{current.question}</Text>
                <View style={styles.separator} />
                {showAnswer && <Text style={styles.answer}>{current.answer}</Text>}
            </View>

            <View style={styles.bottomSection}>
                {!showAnswer ? (
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => setShowAnswer(true)}
                    >
                        <Text style={styles.buttonText}>Mostrar respuesta</Text>
                    </TouchableOpacity>
                ) : (
                    <FlatList
                        data={ratings}
                        horizontal
                        keyExtractor={(item) => item.label}
                        contentContainerStyle={styles.ratingsContainer}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.ratingItem} onPress={handleRate}>
                                <Ionicons name={item.icon} size={34} color={item.color} />
                                <Text style={styles.ratingLabel}>{item.label}</Text>
                            </TouchableOpacity>
                        )}
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 40,
        alignSelf: 'center',
    },
    card: {
        alignItems: 'center',
        marginBottom: 20,
        flexGrow: 1,
        justifyContent: 'center',
    },
    question: {
        fontSize: 24,
        marginBottom: 10,
    },
    separator: {
        height: 1,
        width: '80%',
        backgroundColor: '#999',
        marginVertical: 10,
    },
    answer: {
        fontSize: 22,
        color: '#333',
        marginTop: 10,
    },
    bottomSection: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 20,
    },
    button: {
        backgroundColor: '#6200EE',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 10,
        alignSelf: 'center',
        width: '80%',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        textAlign: 'center',
    },
    ratingsContainer: {
        justifyContent: 'space-around',
        paddingHorizontal: 10,
        width: '100%',
    },
    ratingItem: {
        alignItems: 'center',
        marginHorizontal: 10,
    },
    ratingLabel: {
        fontSize: 12,
        marginTop: 5,
        textAlign: 'center',
    },
});

export default FlashCardGame;
