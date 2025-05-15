import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    FlatList, ActivityIndicator, Alert
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
    ApiStartStudySession,
    ApiGetTheFollowingFlashcard
} from '../../../../api/ApiBank';

const ratings = [
    { label: 'Muy difícil', icon: 'sad-outline', color: '#FF3B30', value: 1 },
    { label: 'Difícil', icon: 'alert-circle-outline', color: '#FF9500', value: 2 },
    { label: 'Bien', icon: 'happy-outline', color: '#34C759', value: 3 },
    { label: 'Muy bien', icon: 'thumbs-up-outline', color: '#0A84FF', value: 4 },
];

const FlashCardGame = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const [bankId, setBankId] = useState(null);
    const [studySessionId, setStudySessionId] = useState(null);
    const [currentFlashcard, setCurrentFlashcard] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sessionFinished, setSessionFinished] = useState(false);

    useEffect(() => {
        const incomingId = route?.params?.bankId;
        if (incomingId) {
            setBankId(incomingId);
        } else {
            Alert.alert("Error", "No se recibió el ID del banco.", [
                { text: "Volver", onPress: () => navigation.goBack() }
            ]);
        }
    }, [route?.params]);

    useEffect(() => {
        const startSession = async () => {
            if (!bankId) return;
            setLoading(true);

            try {
                const res = await ApiStartStudySession(bankId);
                console.log("Respuesta del backend al iniciar sesión de estudio:", res);
                if (res?.firstFlashcard && res?.sessionId) {
                    setStudySessionId(res.sessionId);
                    setCurrentFlashcard({
                        id: res.firstFlashcard._id,
                        front: res.firstFlashcard.front,
                        back: res.firstFlashcard.back,
                    });
                } else {
                    throw new Error(res?.error || "Respuesta inválida");
                }
            } catch (err) {
                Alert.alert("Error", err.message || "No se pudo iniciar la sesión de estudio.");
            }

            setLoading(false);
        };

        startSession();
    }, [bankId]);

    const handleRate = async (feedbackValue) => {
        setShowAnswer(false);
        setLoading(true);

        try {
            const res = await ApiGetTheFollowingFlashcard(
                bankId,
                studySessionId,
                currentFlashcard.id,
                feedbackValue
            );

            if (res?.message === "Study session complete!") {
                setSessionFinished(true);
                if (route.params?.onStudyComplete) {
                    route.params.onStudyComplete();
                }
            } else if (res?._id && res?.front && res?.back) {
                setCurrentFlashcard({
                    id: res._id,
                    front: res.front,
                    back: res.back,
                });
            } else {
                throw new Error("Respuesta inesperada");
            }
        } catch (err) {
            Alert.alert("Error", err.message || "No se pudo continuar la sesión.");
        }

        setLoading(false);
    };

    const handleGoBack = () => navigation.goBack();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Flashcards</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#6200EE" />
            ) : sessionFinished ? (
                <View style={styles.endContainer}>
                    <Text style={styles.endText}>¡Sesión terminada!</Text>
                    <TouchableOpacity style={styles.button} onPress={handleGoBack}>
                        <Text style={styles.buttonText}>Volver</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <View style={styles.card}>
                        <Text style={styles.question}>{currentFlashcard?.front}</Text>
                        <View style={styles.separator} />
                        {showAnswer && <Text style={styles.answer}>{currentFlashcard?.back}</Text>}
                    </View>

                    <View style={styles.bottomSection}>
                        {!showAnswer ? (
                            <TouchableOpacity style={styles.button} onPress={() => setShowAnswer(true)}>
                                <Text style={styles.buttonText}>Mostrar respuesta</Text>
                            </TouchableOpacity>
                        ) : (
                            <FlatList
                                data={ratings}
                                horizontal
                                keyExtractor={(item) => item.label}
                                contentContainerStyle={styles.ratingsContainer}
                                renderItem={({ item }) => (
                                    <TouchableOpacity style={styles.ratingItem} onPress={() => handleRate(item.value)}>
                                        <Ionicons name={item.icon} size={34} color={item.color} />
                                        <Text style={styles.ratingLabel}>{item.label}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        )}
                    </View>
                </>
            )}
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
    endContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    endText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default FlashCardGame;
// Compare this snippet from pagina/src/screen/inicio/Inicio.jsx: