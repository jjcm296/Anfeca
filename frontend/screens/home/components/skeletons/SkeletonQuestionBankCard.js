import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const SkeletonQuestionBankCard = () => {
    return (
        <SkeletonPlaceholder enabled={false}>
            <View style={styles.card}>
                <View style={styles.textContainer}>
                    {/* Título categoría */}
                    <View style={styles.categoryText} />

                    {/* Icono de moneda + número */}
                    <View style={styles.priceContainer}>
                        <View style={styles.coinImage} />
                        <View style={styles.priceText} />
                    </View>

                    {/* Texto de preguntas */}
                    <View style={styles.questionsText} />
                </View>

                {/* Botón de play */}
                <View style={styles.playButton} />
            </View>
        </SkeletonPlaceholder>
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
        marginHorizontal: 10,
        marginTop: 10,
    },
    textContainer: {
        flex: 1,
        marginLeft: 5,
    },
    categoryText: {
        width: 150,
        height: 20,
        borderRadius: 4,
        backgroundColor: '#E0E0E0',
        marginBottom: 8,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    coinImage: {
        width: 25,
        height: 25,
        borderRadius: 12,
        backgroundColor: '#E0E0E0',
        marginRight: 5,
    },
    priceText: {
        width: 40,
        height: 16,
        borderRadius: 4,
        backgroundColor: '#E0E0E0',
    },
    questionsText: {
        width: 100,
        height: 18,
        borderRadius: 4,
        backgroundColor: '#E0E0E0',
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: '#E0E0E0',
        marginLeft: 10,
    },
    playButton: {
        width: 60,
        height: 60,
        borderRadius: 15,
        backgroundColor: '#E0E0E0',
        marginLeft: 10,
        marginRight: 10,
    },
});

export default SkeletonQuestionBankCard;
