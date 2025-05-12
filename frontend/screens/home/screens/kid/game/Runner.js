import React, { useRef, useState, useEffect } from 'react';
import {
    StyleSheet, View, Dimensions, Text,
    TouchableWithoutFeedback, Modal, TouchableOpacity
} from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import * as ScreenOrientation from 'expo-screen-orientation';
import { getEntities } from './entities';
import { Physics } from './Physics';
import { useNavigation } from '@react-navigation/native';
import { resetSpeed } from './GameConfig';
import Matter from 'matter-js';
import { Audio } from 'expo-av';

const { width, height } = Dimensions.get('window');

const Runner = () => {
    const gameEngine = useRef(null);
    const [running, setRunning] = useState(false);
    const [score, setScore] = useState(0);
    const [coins, setCoins] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [entities, setEntities] = useState({});
    const [pressStartTime, setPressStartTime] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [questionModalVisible, setQuestionModalVisible] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [comingFromCheckpoint, setComingFromCheckpoint] = useState(false);
    const navigation = useNavigation();

    const coinSound = useRef();

    useEffect(() => {
        const lockLandscape = async () => {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
        };
        lockLandscape();
        return () => {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        };
    }, []);

    const loadQuestionsFromAPI = async () => {
        return [
            { question: '¿Capital de Francia?', options: ['Madrid', 'París', 'Roma'], correct: 1 },
            { question: '2 + 2 = ?', options: ['3', '4', '5'], correct: 1 },
            { question: 'Color del cielo', options: ['Verde', 'Azul', 'Rojo'], correct: 1 },
            { question: 'React es...', options: ['Librería', 'Framework', 'Base de datos'], correct: 0 },
            { question: 'HTML significa...', options: ['Lenguaje de Marcado', 'Red Social', 'API'], correct: 0 }
        ];
    };

    useEffect(() => {
        const loadSound = async () => {
            const { sound } = await Audio.Sound.createAsync(
                require('../../../../../assets/sounds/coin_bueno.mp3')
            );
            coinSound.current = sound;
        };

        loadSound();

        return () => {
            if (coinSound.current) {
                coinSound.current.unloadAsync();
            }
        };
    }, []);


    const startGame = async () => {
        resetSpeed();
        const newEntities = getEntities(gameEngine.current?.dispatch);
        const apiQuestions = await loadQuestionsFromAPI();
        apiQuestions.forEach((q, i) => q.index = i);
        setQuestions(apiQuestions);

        for (let i = 0; i < 5; i++) {
            const checkpoint = Matter.Bodies.rectangle(
                1400 + i * 600,
                230,
                40,
                10,
                {
                    isStatic: true,
                    label: `checkpoint-${i}`,
                    isSensor: false // asegura colisión real
                }
            );
            Matter.World.add(newEntities.physics.world, [checkpoint]);
            newEntities[`checkpoint-${i}`] = {
                body: checkpoint,
                used: false,
                isActive: true,
                renderer: require('./components/Checkpoint').Checkpoint,
            };
        }


        setEntities(newEntities);
        setScore(0);
        setCoins(0);
        setRunning(true);
        gameEngine.current.swap(newEntities);
    };

    useEffect(() => {
        let cancelled = false;
        const tick = () => {
            if (!running || cancelled) return;

            const currentSpeed = entities?.state?.currentSpeed || 3;
            setScore(prev => {
                const newScore = prev + Math.floor(currentSpeed * 0.5);

                if (newScore % 20 === 0 && gameEngine.current) {
                    gameEngine.current.dispatch({ type: 'increase-speed' });
                }

                const coinExists = Object.keys(entities).some(key => key.startsWith('coin-'));
                if (!coinExists && gameEngine.current) {
                    gameEngine.current.dispatch({ type: 'spawn-coin' });
                }

                return newScore;
            });

            const delay = Math.max(1000 / currentSpeed, 100);
            setTimeout(tick, delay);
        };

        if (running) {
            tick();
        }

        return () => {
            cancelled = true;
        };
    }, [running, entities]);

    const onEvent = (e) => {
        if (e.type === 'game-over') {
            setRunning(false);
            setGameOver(true);
        }
        if (e.type === 'coin-collected' && e.coinId) {
            setCoins(prev => prev + 1);
            if (coinSound.current) {
                coinSound.current.replayAsync();
            }
        }

        if (e.type === 'checkpoint-hit') {
            const index = parseInt(e.id.split('-')[1]);
            const checkpointKey = `checkpoint-${index}`;
            const checkpoint = entities[checkpointKey];

            if (!checkpoint || !checkpoint.isActive) return;

            setCurrentQuestion(questions[index]);
            setQuestionModalVisible(true);
            setRunning(false);
            setComingFromCheckpoint(true);
        }
    };

    const handleRestart = () => {
        setGameOver(false);
        startGame();
    };

    const handleExit = () => {
        setGameOver(false);
        setRunning(false);
        navigation.goBack();
    };

    const handlePressIn = () => {
        if (!running && !gameOver && !comingFromCheckpoint) {
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
                <Text style={styles.coin}>Coins: {coins}</Text>

                <GameEngine
                    ref={gameEngine}
                    style={styles.gameContainer}
                    systems={[Physics]}
                    running={running}
                    entities={entities}
                    onEvent={onEvent}
                />

                {!running && !gameOver && (
                    <View style={styles.overlay}>
                        <Text style={styles.fullScreenText}>Toca para comenzar</Text>
                    </View>
                )}

                <Modal visible={questionModalVisible} transparent animationType="slide">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>{currentQuestion?.question}</Text>
                            {currentQuestion?.options.map((opt, i) => (
                                <TouchableOpacity
                                    key={i}
                                    style={styles.modalButton}
                                    onPress={() => {
                                        setQuestionModalVisible(false);

                                        const checkpointKey = `checkpoint-${currentQuestion.index}`;
                                        const isCorrect = i === currentQuestion.correct;

                                        if (isCorrect) {
                                            if (entities[checkpointKey]) {
                                                entities[checkpointKey].used = true;
                                                entities[checkpointKey].isActive = false;
                                                entities[checkpointKey].renderer = (props) =>
                                                    require('./components/Checkpoint').Checkpoint({ ...props, isActive: false });
                                            }
                                            setEntities({ ...entities });
                                            gameEngine.current.dispatch({ type: 'resume-after-checkpoint' });
                                            setRunning(true);
                                        } else {
                                            setGameOver(true);
                                        }
                                    }}
                                >
                                    <Text style={styles.modalButtonText}>{opt}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </Modal>

                <Modal visible={gameOver} transparent animationType="fade">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>¡Perdiste!</Text>
                            <Text style={styles.modalScore}>Puntaje: {score}</Text>
                            <Text style={styles.modalScore}>Monedas: {coins}</Text>
                            <TouchableOpacity style={styles.modalButton} onPress={handleRestart}>
                                <Text style={styles.modalButtonText}>Reintentar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#ccc' }]} onPress={handleExit}>
                                <Text style={styles.modalButtonText}>Salir</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
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
    coin: {
        fontSize: 20,
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 10,
        fontWeight: 'bold',
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