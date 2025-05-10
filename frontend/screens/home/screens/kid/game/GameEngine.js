import React, { useRef, useState } from 'react';
import { StyleSheet, StatusBar, View, TouchableWithoutFeedback, Alert } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Matter from 'matter-js';

import { Physics } from './Physics';
import { Character } from './components/Character';
import { Obstacle } from './components/Obstacle';
import { getEntities } from './entities';

const Game = () => {
    const engine = useRef(null);
    const [running, setRunning] = useState(true);

    const onEvent = (e) => {
        if (e.type === 'game-over') {
            setRunning(false);
            Alert.alert("Perdiste", "Toca para reiniciar", [
                { text: "Reiniciar", onPress: () => {
                        setRunning(true);
                        engine.current.swap(getEntities());
                    }}
            ]);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={() => {
            engine.current.dispatch({ type: "jump" });
        }}>
            <View style={styles.container}>
                <StatusBar hidden />
                <GameEngine
                    ref={engine}
                    style={styles.container}
                    systems={[Physics]}
                    entities={getEntities()}
                    running={running}
                    onEvent={onEvent}
                />
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

export default Game;
