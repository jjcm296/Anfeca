import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const QuestionBankCard = ({ category, questions }) => {
    return (
        <View style={styles.card}>
            <View style={styles.textContainer}>
                {/* Categoría dinámica */}
                <Text style={styles.categoryText}>{category}</Text>

                {/* Coins (valor fijo) */}
                <View style={styles.priceContainer}>
                    <Image source={require('../../../images/Coins_bueno.png')} style={styles.coinImage} />
                    <Text style={styles.priceText}>1</Text>
                </View>

                {/* Número de Preguntas dinámico */}
                <Text style={styles.questionsText}>Preguntas: {questions}</Text>
            </View>

            {/* Imagen (valor fijo) */}
            <Image
                source={{ uri: 'https://via.placeholder.com/150' }} // Imagen estática
                style={styles.image}
            />

            {/* Botón de Play */}
            <TouchableOpacity style={styles.playButton}>
                <Ionicons name="play" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF', // Blanco para mejor contraste
        borderRadius: 20, // Esquinas más redondeadas
        padding: 15,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 10,
        marginTop: 5, // Mayor separación entre tarjetas
    },
    playButton: {
        width: 60,
        height: 60,
        borderRadius: 15,
        backgroundColor: '#A0A0A0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10, // Espaciado entre imagen y botón
    },
    textContainer: {
        flex: 1,
        marginLeft: 5,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 1, // Mayor separación con "Preguntas"
    },
    coinImage: {
        width: 25, // Tamaño reducido de la moneda
        height: 25,
        resizeMode: 'contain',
        marginRight: -5, // Mueve la moneda más a la izquierda
    },
    priceText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
        marginLeft: 5, // Reduce el espacio entre la moneda y el número
        lineHeight: 20, // Aumenta el espacio entre líneas
    },
    categoryText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2, // Mayor separación con el precio
        lineHeight: 28, // Aumenta el interlineado
    },
    questionsText: {
        fontSize: 16,
        color: '#555',
        lineHeight: 22, // Espaciado entre líneas del texto
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginLeft: 10, // Espaciado entre imagen y botón
    },
});

export default QuestionBankCard;
