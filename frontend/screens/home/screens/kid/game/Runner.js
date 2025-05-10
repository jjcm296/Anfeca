import React, { useRef, useState } from 'react';
import { StyleSheet, View, Dimensions, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import { getEntities } from './entities';
import Physics from './Physics';

const { width, height } = Dimensions.get('window');

const Runner = () => {
    const gameEngine = useRef(null);
    const [running, setRunning] = useState(false);
    const [score, setScore] = useState(0);

    const onEvent = (e) => {
        if (e.type === 'game-over') {
            setRunning(false);
        } else if (e.type === 'score') {
            setScore((prev) => prev + 1);
        }
    };

    const handleTouch = () => {
        if (!running) {
            setScore(0);
            setRunning(true);
            gameEngine.current.swap(getEntities());
        } else {
            gameEngine.current.dispatch({ type: 'jump' });
        }
    };

    return (
        <TouchableWithoutFeedback onPress={handleTouch}>
            <View style={styles.container}>
                <Text style={styles.score}>Score: {score}</Text>
                <GameEngine
                    ref={gameEngine}
                    style={styles.gameContainer}
                    systems={[Physics]}
                    running={running}
                    entities={getEntities()}
                    onEvent={onEvent}
                />
                {!running && (
                    <View style={styles.overlay}>
                        <Text style={styles.fullScreenText}>Toca para comenzar</Text>
                    </View>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
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
    },
    fullScreenText: {
        color: '#FFF',
        fontSize: 22,
        fontWeight: 'bold',
    },
    score: {
        fontSize: 20,
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 10,
        fontWeight: 'bold',
    },
});

export default Runner;
