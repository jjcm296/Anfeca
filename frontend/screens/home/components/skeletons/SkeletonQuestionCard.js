import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const SkeletonQuestionCard = () => {
    return (
        <View style={styles.wrapper}>
            <SkeletonPlaceholder enabled={false}>
                <View style={styles.card}>
                    {/* Contenedor del texto */}
                    <View style={styles.textContainer}>
                        <View style={styles.questionNumber} />
                        <View style={styles.questionText} />
                    </View>

                    {/* Ícono simulado */}
                    <View style={styles.icon} />
                </View>
            </SkeletonPlaceholder>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        marginVertical: 5,
        marginHorizontal: 5,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        elevation: 3,
        shadowRadius: 5,
    },
    card: {
        flexDirection: 'row',
        padding: 15,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 20,
    },
    textContainer: {
        flex: 1,
    },
    questionNumber: {
        width: 140,
        height: 18,
        borderRadius: 4,
        backgroundColor: '#E0E0E0',
        marginBottom: 6,
    },
    questionText: {
        width: '90%',
        height: 16,
        borderRadius: 4,
        backgroundColor: '#E0E0E0',
    },
    icon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#E0E0E0',
        marginLeft: 10,
    },
});

export default SkeletonQuestionCard;
