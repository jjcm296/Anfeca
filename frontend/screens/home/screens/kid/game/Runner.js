import React, {useRef, useState, useEffect, useCallback} from 'react';
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
import { ImageBackground} from 'react-native';

const { width, height } = Dimensions.get('window');

const Runner = () => {
    const tickActiveRef = useRef(true);
    const animationFrameRef = useRef();


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
    const [alreadySubmitted, setAlreadySubmitted] = useState(false);


    useEffect(() => {
        console.log("BANK ID ACTUAL:", bankId);
    }, [bankId]);

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
                id: q._id, // 👈 necesario para enviar después
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

    const generateFinishLine = (world, entityMap, xPos = 2000) => {
        const finishLine = Matter.Bodies.rectangle(
            xPos,
            230,
            40,
            40,
            { isStatic: true, label: 'finish-line' }
        );
        Matter.World.add(world, [finishLine]);
        entityMap['finish-line'] = {
            body: finishLine,
            renderer: require('./components/FinishLine').FinishLine,
        };
        setEntities({ ...entityMap });
    };

    const startGame = useCallback(async () => {
        resetSpeed();
        const newEntities = getEntities(gameEngine.current?.dispatch);
        console.log("Cargando juego con bankId:", bankId);
        const questionsFromAPI = await loadQuestionsFromAPI(bankId);
        if (!questionsFromAPI.length) return;

        setQuestions(questionsFromAPI);
        setAnsweredQuestions([]);
        setResultSent(false);
        setRunningCoins(0);
        setLastCheckpointId(null);
        unansweredIndexRef.current = 0;

        if (questionsFromAPI.length > 0) {
            checkpointCountRef.current = 0;

            // Generar posiciones aleatorias para cada checkpoint
            const startX = 1400;
            const minSpacing = 800;
            const maxSpacing = 1100;

            let x = startX;
            const checkpointPositions = [];

            for (let i = 0; i < questionsFromAPI.length; i++) {
                const spacing = Math.floor(Math.random() * (maxSpacing - minSpacing + 1)) + minSpacing;
                x += spacing;
                checkpointPositions.push(x);
            }

            // Crear los checkpoints con las posiciones generadas
            checkpointPositions.forEach((pos, index) => {
                const checkpoint = Matter.Bodies.rectangle(
                    pos,
                    230,
                    40,
                    10,
                    { isStatic: true, label: `checkpoint-${index}`, isSensor: false }
                );
                Matter.World.add(newEntities.physics.world, [checkpoint]);
                newEntities[`checkpoint-${index}`] = {
                    body: checkpoint,
                    used: false,
                    isActive: true,
                    renderer: require('./components/Checkpoint').Checkpoint,
                };
            });
        }

        setEntities(newEntities);
        setScore(0);
        setCoins(0);
        setGameWon(false);
        tickActiveRef.current = true;
        setRunning(true);
        gameEngine.current.swap(newEntities);
    }, [bankId]);


useEffect(() => {
        let cancelled = false;
        const tick = () => {
            if (!tickActiveRef.current || questionModalVisible) return;

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
                if (!activeCheckpoint && unanswered.length > 0 && checkpointCountRef.current < questions.length) {
                    const newIndex = checkpointCountRef.current++;
                    generateCheckpoint(newIndex, entities.physics.world, entities);
                    setEntities({ ...entities });
                }


                return newScore;
            });

            animationFrameRef.current = requestAnimationFrame(tick);
        };

        if (running) tick();
    return () => {
        cancelAnimationFrame(animationFrameRef.current);
    };

}, [running, entities]);

    useEffect(() => {
        if (gameWon && !resultSent && gameSessionId) {
            const payload = {
                questions: answeredQuestions,
                individualCoins: runningCoins
            };
            ApiSendGameResult(bankId, gameSessionId, payload);
            console.log("Enviando resultado:", payload);
            setResultSent(true);
        }
    }, [gameWon]);

    const onEvent = async (e) => {
        if (e.type === 'game-over') {
            setRunning(false);
            setGameOver(true);
            tickActiveRef.current = false;

            const allAnswered = questions.length > 0 && answeredQuestions.length === questions.length;

            if (allAnswered && !resultSent && gameSessionId) {
                const payload = {
                    questions: answeredQuestions,
                    individualCoins: runningCoins,
                };
                const res = await ApiSendGameResult(bankId, gameSessionId, payload);
                setResultSent(true);
                setAlreadySubmitted(true); // desactiva reinicio
            }
        }

        if (e.type === 'game-won') {
            setRunning(false);
            setGameWon(true);
            tickActiveRef.current = false;
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

        setAnsweredQuestions(prev => {
            const updated = [...prev, {
                questionId: currentQuestion.id || currentQuestion._id,
                answeredCorrectly: isCorrect
            }];

            const totalQuestions = questions.length;
            if (updated.length === totalQuestions && !entities['finish-line']) {
                generateFinishLine(entities.physics.world, entities);
            }

            return updated;
        });


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
        <ImageBackground
            source={require('../../../../../assets/game/background_large.jpg')}
            style={styles.background}
            resizeMode="cover"
        >
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

                    {gameOver && (
                        <Modal visible={true} transparent animationType="fade">
                            <View style={styles.modalContainer}>
                                <View style={styles.victoryContent}>
                                    <Text style={[styles.victoryTitle, { color: '#DC3545' }]}>💥 ¡Ups!</Text>
                                    <Text style={styles.victoryMessage}>Has chocado con un obstáculo</Text>
                                    <Text style={styles.victoryScore}>Puntaje: {score}</Text>
                                    <Text style={styles.victoryScore}>Monedas: {coins}</Text>

                                    {!alreadySubmitted && (
                                        <TouchableOpacity
                                            style={[styles.victoryButton, { backgroundColor: '#DC3545' }]}
                                            onPress={() => {
                                                setGameOver(false);
                                                startGame();
                                            }}
                                        >
                                            <Text style={styles.victoryButtonText}>Reintentar</Text>
                                        </TouchableOpacity>
                                    )}

                                    <TouchableOpacity
                                        style={[styles.victoryButton, { backgroundColor: '#6c757d', marginTop: 10 }]}
                                        onPress={() => navigation.goBack()}
                                    >
                                        <Text style={styles.victoryButtonText}>Salir</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    )}
                </View>
            </TouchableWithoutFeedback>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    gameContainer: {
        flex: 1,
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
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    victoryContent: {
        width: 320,
        backgroundColor: '#F4F4FA', // fondo claro suave
        padding: 25,
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#A26BFA' // morado principal
    },
    victoryTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#A26BFA',
        marginBottom: 5,
    },
    victoryMessage: {
        fontSize: 18,
        color: '#4A4A4A',
        marginBottom: 20,
    },
    victoryScore: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10,
    },
    victoryButton: {
        marginTop: 20,
        backgroundColor: '#28A745',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
    },
    victoryButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },

});

export default Runner;
