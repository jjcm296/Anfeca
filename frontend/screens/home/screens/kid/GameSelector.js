import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const GameSelector = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { bankId, bankName } = route.params;

    console.log("📦 GameSelector route.params:", route.params);
    console.log("✅ bankId recibido:", bankId);
    console.log("✅ bankName recibido:", bankName);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Selecciona un modo de juego</Text>

            <TouchableOpacity
                style={[styles.button, styles.cardMode]}
                onPress={() => navigation.navigate("FlashCardGame", { bankId, bankName })}
            >
                <Ionicons name="albums-outline" size={26} color="#fff" />
                <Text style={styles.buttonText}>Modo Tarjetas</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, styles.gameMode]}
                onPress={() => navigation.navigate("RunnerGame", { bankId, bankName })}
            >
                <Ionicons name="game-controller-outline" size={26} color="#fff" />
                <Text style={styles.buttonText}>Modo Juego</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.backText}>Volver</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingVertical: 15,
        borderRadius: 12,
        marginVertical: 10,
    },
    cardMode: {
        backgroundColor: '#3E9697',
    },
    gameMode: {
        backgroundColor: '#FF7B54',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 10,
        fontWeight: 'bold',
    },
    backText: {
        color: '#888',
        textDecorationLine: 'underline',
        marginTop: 20,
    },
});

export default GameSelector;
