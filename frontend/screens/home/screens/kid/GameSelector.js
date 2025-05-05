import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from "@react-navigation/native";

const GameSelector = ({ visible, onClose, bankId, bankName }) => {
    const navigation = useNavigation();
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modalCard}>
                    <Text style={styles.title}>Selecciona un modo de juego</Text>

                    <TouchableOpacity
                        style={[styles.button, styles.cardMode]}
                        onPress={() => {
                            onClose();
                            navigation.navigate('FlashCardGame', { bankId, bankName });
                        }}
                    >
                        <Ionicons name="albums-outline" size={26} color="#fff" />
                        <Text style={styles.buttonText}>Modo Tarjetas</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.gameMode]}
                        onPress={() => {
                            onClose();
                            // Aquí puedes añadir navegación para el modo 'game' si lo deseas
                        }}
                    >
                        <Ionicons name="game-controller-outline" size={26} color="#fff" />
                        <Text style={styles.buttonText}>Modo Juego</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                        <Text style={styles.closeText}>Cerrar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalCard: {
        backgroundColor: '#fff',
        padding: 25,
        borderRadius: 20,
        width: '80%',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
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
    closeBtn: {
        marginTop: 15,
    },
    closeText: {
        color: '#888',
        textDecorationLine: 'underline',
    },
});

export default GameSelector;
