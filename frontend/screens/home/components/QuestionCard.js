import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const QuestionCard = ({ questionNumber, questionText, onPress }) => {
    return (
        <View style={styles.card} onPress={onPress}>
            {/* Contenedor del texto */}
            <View style={styles.textContainer}>
                <Text style={styles.questionNumber}>Question {questionNumber}</Text>
                <Text style={styles.questionText}>{questionText}</Text>
            </View>

            {/* Icono de navegación */}
            <Ionicons name="chevron-forward" size={24} color="#6200EE" />
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowRadius: 5,
        elevation: 3,
        marginVertical: 5, // Espaciado entre tarjetas
        marginHorizontal: 5, // Espaciado lateral
    },
    textContainer: {
        flex: 1,
    },
    questionNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    questionText: {
        fontSize: 14,
        color: '#000000',
    },
});

export default QuestionCard;
