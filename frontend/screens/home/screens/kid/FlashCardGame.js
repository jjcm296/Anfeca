import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    ActivityIndicator, Alert, Animated, Image
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
    ApiStartStudySession,
    ApiGetTheFollowingFlashcard
} from '../../../../api/ApiBank';
import CoinsDisplay from '../../../ui/components/CoinsDisplay';

const mascots = [
    { image: require('../../../../assets/mascota/frente.png'), message: '¡Tú puedes lograrlo! 🦊' },
    { image: require('../../../../assets/mascota/Caminando.png'), message: '¡Estoy orgulloso de ti! 🐼' },
    { image: require('../../../../assets/mascota/Feliz.png'), message: '¡Qué buena respuesta! 🐶' },
    { image: require('../../../../assets/mascota/Durmiendo.png'), message: '¡Vamos, tú puedes! 🦁' },
    { image: require('../../../../assets/mascota/Parado.png'), message: '¡Sigue así, campeón! 🐸' },
    { image: require('../../../../assets/mascota/Pose1.png'), message: '¡Estoy orgulloso de ti! 🐷' }
];

const mascotaFinal = {
    image: require('../../../../assets/mascota/asombrado.png'),
};

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
    const [loading, setLoading] = useState(true);
    const [sessionFinished, setSessionFinished] = useState(false);
    const [flipped, setFlipped] = useState(false);

    const rotation = useRef(new Animated.Value(0)).current;

    const frontInterpolate = rotation.interpolate({ inputRange: [0, 180], outputRange: ['0deg', '180deg'] });
    const backInterpolate = rotation.interpolate({ inputRange: [0, 180], outputRange: ['180deg', '360deg'] });

    const randomMascot = mascots[Math.floor(Math.random() * mascots.length)];

    useEffect(() => {
        const incomingId = route?.params?.bankId;
        if (incomingId) setBankId(incomingId);
        else Alert.alert("Error", "No se recibió el ID del banco.", [{ text: "Volver", onPress: () => navigation.goBack() }]);
    }, [route?.params]);

    useEffect(() => {
        const startSession = async () => {
            if (!bankId) return;
            setLoading(true);
            try {
                const res = await ApiStartStudySession(bankId);
                if (res?.firstFlashcard && res?.sessionId) {
                    setStudySessionId(res.sessionId);
                    setCurrentFlashcard({ id: res.firstFlashcard._id, front: res.firstFlashcard.front, back: res.firstFlashcard.back });
                } else throw new Error(res?.error || "Respuesta inválida");
            } catch (err) {
                Alert.alert("Error", err.message || "No se pudo iniciar la sesión de estudio.");
            }
            setLoading(false);
        };
        startSession();
    }, [bankId]);

    const flipCard = () => {
        Animated.spring(rotation, { toValue: flipped ? 0 : 180, useNativeDriver: true }).start();
        setFlipped(!flipped);
    };

    const handleRate = async (feedbackValue) => {
        setLoading(true);
        setFlipped(false);
        rotation.setValue(0);
        try {
            const res = await ApiGetTheFollowingFlashcard(bankId, studySessionId, currentFlashcard.id, feedbackValue);
            if (res?.message === "Study session complete!") {
                setSessionFinished(true);
                if (route.params?.onStudyComplete) route.params.onStudyComplete();
            } else if (res?._id && res?.front && res?.back) {
                setCurrentFlashcard({ id: res._id, front: res.front, back: res.back });
            } else throw new Error("Respuesta inesperada");
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
                <View style={styles.endCelebration}>
                    <Image source={mascotaFinal.image} style={styles.finalMascot} resizeMode="contain" />
                    <Text style={styles.endTitle}>¡Lección completada!</Text>
                    <View style={{ marginBottom: 12 }}>
                        <CoinsDisplay/>
                        <Text style={{ color: 'black', fontSize: 20, marginLeft: 15 }}>1</Text>
                    </View>
                    <View style={styles.progressBarContainer}><View style={styles.progressBarFill} /></View>
                    <Text style={styles.endMessage}>Puedes ganar más monedas en el minijuego</Text>
                    <TouchableOpacity style={styles.continueButton} onPress={handleGoBack}>
                        <Text style={styles.continueText}>CONTINUAR</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <TouchableOpacity activeOpacity={0.9} onPress={flipCard} style={styles.cardWrapper}>
                        <Animated.View style={[styles.card, { transform: [{ rotateY: frontInterpolate }] }]}>
                            <Text style={styles.question}>{currentFlashcard?.front}</Text>
                            <Ionicons name="sync" size={28} color="#ffffff99" style={styles.flipIcon} />
                        </Animated.View>
                        <Animated.View style={[styles.card, styles.cardBack, { transform: [{ rotateY: backInterpolate }] }]}>
                            <Text style={styles.answer}>{currentFlashcard?.back}</Text>
                            <Ionicons name="sync" size={28}  color="#ffffff99" style={styles.flipIcon} />
                            <Ionicons />
                        </Animated.View>
                    </TouchableOpacity>

                    <View style={styles.mascotSpace}>
                        <Image source={randomMascot.image} style={styles.mascotImage} resizeMode="contain" />
                        <View style={styles.speechBubble}>
                            <Text style={styles.speechText}>{randomMascot.message}</Text>
                        </View>
                    </View>

                    <View style={styles.bottomFixedSection}>
                        {!flipped ? (
                            <TouchableOpacity style={styles.button} onPress={flipCard}>
                                <Text style={styles.buttonText}>Mostrar respuesta</Text>
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.ratingsContainer}>
                                {ratings.map((item) => (
                                    <TouchableOpacity key={item.label} style={styles.ratingItem} onPress={() => handleRate(item.value)}>
                                        <Ionicons name={item.icon} size={34} color={item.color} />
                                        <Text style={styles.ratingLabel}>{item.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F8F8', padding: 24 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#2f5c98', textAlign: 'center', marginBottom: 20 },
    cardWrapper: { width: '100%', height: 220, alignSelf: 'center', marginBottom: 20 },
    card: { position: 'absolute', width: '100%', height: '100%', backgroundColor: '#f77328', borderRadius: 24, justifyContent: 'center', alignItems: 'center', backfaceVisibility: 'hidden', shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: { width: 0, height: 6 }, shadowRadius: 10, elevation: 6, padding: 30 },
    cardBack: { backgroundColor: '#2faaf6' },
    question: { fontSize: 26, color: '#ffffff', textAlign: 'center', fontWeight: 'bold' },
    answer: { fontSize: 24, color: '#ffffff', textAlign: 'center', fontWeight: '600' },
    flipIcon: { position: 'absolute', bottom: 12, right: 12, opacity: 0.6 },
    mascotSpace: { height: 140, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
    mascotImage: { width: 150, height: 150, marginTop: 50 },
    speechBubble: { backgroundColor: '#ffffff', padding: 12, borderRadius: 16, maxWidth: '90%', borderWidth: 2, borderColor: '#2f5c98', shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 3 }, shadowRadius: 5, elevation: 2 },
    speechText: { fontSize: 14, fontWeight: '600', color: '#2f5c98', textAlign: 'center' },
    bottomFixedSection: { marginTop: 'auto', paddingBottom: 30, alignItems: 'center', width: '100%' },
    button: { backgroundColor: '#56b448', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 20, elevation: 4, marginTop: 10, width: '80%' },
    buttonText: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
    ratingsContainer: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', marginTop: 24, width: '100%' },
    ratingItem: { backgroundColor: '#ffffff', borderRadius: 18, paddingVertical: 12, paddingHorizontal: 10, alignItems: 'center', width: 70, height: 100, shadowColor: '#000', shadowOpacity: 0.15, shadowOffset: { width: 0, height: 4 }, shadowRadius: 6, elevation: 3 },
    ratingLabel: { fontSize: 14, marginTop: 6, color: '#2f5c98', fontWeight: '500', textAlign: 'center' },
    endCelebration: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    finalMascot: { width: 160, height: 160, marginBottom: 24 },
    endTitle: { fontSize: 24, fontWeight: 'bold', color: '#F8F8F8', marginBottom: 8 },
    endExp: { fontSize: 20, fontWeight: 'bold', color: '#ff9500', marginBottom: 24 },
    progressBarContainer: { width: '80%', height: 12, backgroundColor: '#eee', borderRadius: 10, marginBottom: 16, overflow: 'hidden' },
    progressBarFill: { width: '50%', height: '100%', backgroundColor: '#f6ce4b' },
    endMessage: { textAlign: 'center', fontSize: 14, color: '#333', marginBottom: 30 },
    continueButton: { backgroundColor: '#0A84FF', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 25 },
    continueText: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 },
});

export default FlashCardGame;
