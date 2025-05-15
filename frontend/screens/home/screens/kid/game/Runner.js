import React, { useRef, useState, useEffect } from 'react';
import {
    StyleSheet, View, Dimensions, Text,
    TouchableWithoutFeedback, Modal, TouchableOpacity, Animated
} from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import * as ScreenOrientation from 'expo-screen-orientation';
import { getEntities } from './entities';
import { Physics } from './Physics';
import { useNavigation, useRoute } from '@react-navigation/native';
import { resetSpeed } from './GameConfig';
import Matter from 'matter-js';
import { Audio } from 'expo-av';
import { ApiStartGame, ApiSendGameResult } from '../../../../../api/ApiBank';
import CoinsDisplay from '../../../../ui/components/CoinsDisplay';
import { ApiRefreshAccessToken } from '../../../../../api/ApiLogin';

const { width, height } = Dimensions.get('window');

const Runner = () => {
    const gameEngine = useRef(null);
    const [running, setRunning] = useState(false);
    const [score, setScore] = useState(0);
    const [coins, setCoins] = useState(0);
    const [runningCoins, setRunningCoins] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [entities, setEntities] = useState({});
    const [pressStartTime, setPressStartTime] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answeredQuestions, setAnsweredQuestions] = useState([]);
    const [questionModalVisible, setQuestionModalVisible] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [comingFromCheckpoint, setComingFromCheckpoint] = useState(false);
    const [gameSessionId, setGameSessionId] = useState(null);
    const [resultSent, setResultSent] = useState(false);
    const [coinAnim] = useState(new Animated.Value(1));
    const navigation = useNavigation();
    const route = useRoute();
    const [lastCheckpointId, setLastCheckpointId] = useState(null);
    const checkpointCountRef = useRef(0);
    const unansweredIndexRef = useRef(0);

    const { bankId } = route.params;

    const coinSound = useRef();
    const correctSound = useRef();
    const wrongSound = useRef();

    useEffect(() => {
        const lockLandscape = async () => {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
        };
        lockLandscape();
        return () => {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        };
    }, []);

    const loadQuestionsFromAPI = async (bankId) => {
        await ApiRefreshAccessToken();
        const response = await ApiStartGame(bankId);
        if (response?.questions && response?.sessionId) {
            setGameSessionId(response.sessionId);
            return response.questions.map((q, i) => ({
                question: q.textQuestion,
                options: q.answers.map(a => a.textAnswer),
                correct: q.answers.findIndex(a => a.isCorrect),
                priority: q.priority || 1,
                index: i
            }));
        }
        return [];
    };

    useEffect(() => {
        const loadSound = async () => {
            const { sound: coin } = await Audio.Sound.createAsync(
                require('../../../../../assets/sounds/coin_bueno.mp3')
            );
            coinSound.current = coin;

            const { sound: correct } = await Audio.Sound.createAsync(
                require('../../../../../assets/sounds/respuesta_correcta.mp3')
            );
            correctSound.current = correct;

            const { sound: wrong } = await Audio.Sound.createAsync(
                require('../../../../../assets/sounds/respuesta_incorrecta.mp3')
            );
            wrongSound.current = wrong;
        };
        loadSound();
        return () => {
            coinSound.current?.unloadAsync();
            correctSound.current?.unloadAsync();
            wrongSound.current?.unloadAsync();
        };
    }, []);

    const animateCoin = () => {
        Animated.sequence([
            Animated.timing(coinAnim, { toValue: 1.5, duration: 200, useNativeDriver: true }),
            Animated.timing(coinAnim, { toValue: 1, duration: 200, useNativeDriver: true })
        ]).start();
    };

    const generateCheckpoint = (index, world, entityMap) => {
        const checkpoint = Matter.Bodies.rectangle(
            1400 + index * 800 + 100,
            230,
            40,
            10,
            { isStatic: true, label: `checkpoint-${index}`, isSensor: false }
        );
        Matter.World.add(world, [checkpoint]);
        entityMap[`checkpoint-${index}`] = {
            body: checkpoint,
            used: false,
            isActive: true,
            renderer: require('./components/Checkpoint').Checkpoint,
        };
    };

    const getNextUnansweredQuestion = () => {
        const unanswered = questions.filter(
            (q) => !answeredQuestions.some((a) => a.question === q.question)
        );
        if (unanswered.length === 0) return null;
        const next = unanswered[unansweredIndexRef.current % unanswered.length];
        unansweredIndexRef.current++;
        return next;
    };

    const startGame = async () => {
        resetSpeed();
        const newEntities = getEntities(gameEngine.current?.dispatch);
        const questionsFromAPI = await loadQuestionsFromAPI(bankId);
        if (!questionsFromAPI.length) return;

        setQuestions(questionsFromAPI);
        setAnsweredQuestions([]);
        setResultSent(false);
        setRunningCoins(0);
        setLastCheckpointId(null);
        unansweredIndexRef.current = 0;

        if (questionsFromAPI.length > 0) {
            checkpointCountRef.current = 1;
            generateCheckpoint(0, newEntities.physics.world, newEntities);
        }

        const finishLine = Matter.Bodies.rectangle(
            1400 + 20 * 600,
            230,
            40,
            40,
            { isStatic: true, label: 'finish-line' }
        );
        Matter.World.add(newEntities.physics.world, [finishLine]);
        newEntities['finish-line'] = {
            body: finishLine,
            renderer: require('./components/FinishLine').FinishLine,
        };

        setEntities(newEntities);
        setScore(0);
        setCoins(0);
        setGameWon(false);
        setRunning(true);
        gameEngine.current.swap(newEntities);
    };

    useEffect(() => {
        let cancelled = false;
        const tick = () => {
            if (!running) return;

            const currentSpeed = entities?.state?.currentSpeed || 3;
            setScore(prev => {
                const newScore = prev + Math.floor(currentSpeed * 0.5);
                if (newScore % 20 === 0) gameEngine.current?.dispatch({ type: 'increase-speed' });

                // Spawn coin si no hay
                if (!Object.keys(entities).some(key => key.startsWith('coin-')))
                    gameEngine.current?.dispatch({ type: 'spawn-coin' });

                // Revisar si hay preguntas sin responder
                const unanswered = questions.filter(
                    (q) => !answeredQuestions.some((a) => a.question === q.question)
                );

                // Revisar si hay checkpoint activo
                const activeCheckpoint = Object.keys(entities).find(
                    (key) => key.startsWith('checkpoint-') && entities[key]?.isActive
                );

                // Si no hay checkpoint activo y hay preguntas pendientes, genera uno nuevo
                if (!activeCheckpoint && unanswered.length > 0) {
                    const newIndex = checkpointCountRef.current++;
                    generateCheckpoint(newIndex, entities.physics.world, entities);
                    setEntities({ ...entities });
                }

                return newScore;
            });

            setTimeout(tick, Math.max(1000 / currentSpeed, 100));
        };

        if (running) tick();
        return () => { cancelled = true; };
    }, [running, entities]);

    useEffect(() => {
        if (gameWon && !resultSent && gameSessionId) {
            const payload = {
                questions: answeredQuestions,
                individualCoins: runningCoins
            };
            ApiSendGameResult(bankId, gameSessionId, payload);
            setResultSent(true);
        }
    }, [gameWon]);

    const onEvent = (e) => {
        if (e.type === 'game-over') {
            setRunning(false);
            setGameOver(true);
        }
        if (e.type === 'game-won') {
            setRunning(false);
            setGameWon(true);
        }
        if (e.type === 'coin-collected' && e.coinId) {
            setCoins(prev => prev + 1);
            setRunningCoins(prev => prev + 1);
            coinSound.current?.replayAsync();
            animateCoin();
        }
        if (e.type === 'checkpoint-hit') {
            const checkpointKey = e.id;
            const checkpoint = entities[checkpointKey];
            if (!checkpoint || !checkpoint.isActive) return;

            const unanswered = questions.filter(
                (q) => !answeredQuestions.some((a) => a.question === q.question)
            );
            if (unanswered.length === 0) return;

            // Desactivar el checkpoint inmediatamente para permitir crear otro si se ignora esta pregunta
            if (entities[checkpointKey]) {
                entities[checkpointKey].used = true;
                entities[checkpointKey].isActive = false;
                entities[checkpointKey].renderer = (props) =>
                    require('./components/Checkpoint').Checkpoint({ ...props, isActive: false });
            }

            setEntities({ ...entities });

            // Tomar la siguiente pregunta ciclando
            const next = unanswered[unansweredIndexRef.current % unanswered.length];
            unansweredIndexRef.current++;

            setLastCheckpointId(checkpointKey);
            setCurrentQuestion(next);
            setQuestionModalVisible(true);
            setRunning(false);
            setComingFromCheckpoint(true);
        }
    };


    const handleAnswer = (isCorrect) => {
        const checkpointKey = lastCheckpointId;
        if (!checkpointKey) return;

        const priority = currentQuestion?.priority || 1;
        const coinsToAdd = priority;

        if (isCorrect) {
            correctSound.current?.replayAsync();
            setCoins(prev => prev + coinsToAdd);
            animateCoin();
        } else {
            wrongSound.current?.replayAsync();
        }

        if (entities[checkpointKey]) {
            entities[checkpointKey].used = true;
            entities[checkpointKey].isActive = false;
            entities[checkpointKey].renderer = (props) =>
                require('./components/Checkpoint').Checkpoint({ ...props, isActive: false });
        }

        setEntities({ ...entities });

        setAnsweredQuestions(prev => [...prev, {
            question: currentQuestion.question,
            answeredCorrectly: isCorrect
        }]);

        setLastCheckpointId(null);

        gameEngine.current.dispatch({ type: 'resume-after-checkpoint' });
        setRunning(true);
    };

    const handlePressIn = () => {
        if (!running && !gameOver && !comingFromCheckpoint && !gameWon) {
            startGame();
        }
        setComingFromCheckpoint(false);
        if (running) setPressStartTime(Date.now());
    };

    const handlePressOut = () => {
        if (!running || pressStartTime === null) return;
        const pressDuration = Date.now() - pressStartTime;
        const strength = Math.min(pressDuration / 100, 10);
        gameEngine.current.dispatch({ type: 'jump', strength });
        setPressStartTime(null);
    };

    return (
        <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut}>
            <View style={styles.container}>
                <Text style={styles.score}>Score: {score}</Text>
                <Animated.View style={[styles.coinAnimated, { transform: [{ scale: coinAnim }] }]}>
                    <CoinsDisplay coins={coins}/>
                </Animated.View>
                <GameEngine
                    ref={gameEngine}
                    style={styles.gameContainer}
                    systems={[Physics]}
                    running={running}
                    entities={entities}
                    onEvent={onEvent}
                />
                {!running && !gameOver && !gameWon && (
                    <View style={styles.overlay}>
                        <Text style={styles.fullScreenText}>Toca para comenzar</Text>
                    </View>
                )}
                <Modal visible={questionModalVisible} transparent animationType="slide">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>{currentQuestion?.question}</Text>
                            <Text style={{ fontSize: 16, marginBottom: 10 }}>
                                {currentQuestion?.priority ? `Recompensa: +${currentQuestion.priority} moneda${currentQuestion.priority > 1 ? 's' : ''}` : ''}
                            </Text>
                            {Array.isArray(currentQuestion?.options) &&
                                currentQuestion.options.map((opt, i) => (
                                    <TouchableOpacity
                                        key={i}
                                        style={styles.modalButton}
                                        onPress={() => {
                                            setQuestionModalVisible(false);
                                            handleAnswer(i === currentQuestion.correct);
                                        }}
                                    >
                                        <Text style={styles.modalButtonText}>{opt}</Text>
                                    </TouchableOpacity>
                                ))}
                        </View>
                    </View>
                </Modal>
                {(gameOver || gameWon) && (
                    <Modal visible={true} transparent animationType="fade">
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>{gameWon ? '¡Ganaste!' : '¡Perdiste!'}</Text>
                                <Text style={styles.modalScore}>Puntaje: {score}</Text>
                                <Text style={styles.modalScore}>Monedas: {coins}</Text>
                                <TouchableOpacity style={styles.modalButton} onPress={() => {
                                    setGameOver(false);
                                    setGameWon(false);
                                    startGame();
                                }}>
                                    <Text style={styles.modalButtonText}>Reintentar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, { backgroundColor: '#ccc' }]}
                                    onPress={() => navigation.goBack()}
                                >
                                    <Text style={styles.modalButtonText}>Salir</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        flexDirection: 'row',
    },
    gameContainer: {
        flex: 1,
        backgroundColor: '#EEE',
    },
    overlay: {
        position: 'absolute',
        top: height / 2 - 40,
        left: width / 2 - 120,
        width: 240,
        height: 80,
        backgroundColor: '#000000AA',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        zIndex: 999,
    },
    fullScreenText: {
        color: '#FFF',
        fontSize: 22,
        fontWeight: 'bold',
    },
    score: {
        fontSize: 20,
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 10,
        fontWeight: 'bold',
    },
    coinAnimated: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 10,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: 300,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalScore: {
        fontSize: 18,
        marginBottom: 10,
    },
    modalButton: {
        backgroundColor: '#6200EE',
        padding: 10,
        borderRadius: 10,
        width: 220,
        alignItems: 'center',
        marginVertical: 5,
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default Runner;
