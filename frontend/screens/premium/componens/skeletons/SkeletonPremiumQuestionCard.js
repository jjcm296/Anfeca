
import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const SkeletonPremiumQuestionCard = () => {
    return (
        <View style={styles.card}>
            <View style={styles.title} />
            <View style={styles.line} />
            <View style={styles.lineShort} />
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#eee',
        padding: 20,
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: 1.2,
        borderColor: '#ccc',
    },
    title: {
        height: 20,
        width: '60%',
        backgroundColor: '#ddd',
        borderRadius: 6,
        marginBottom: 12,
    },
    line: {
        height: 14,
        width: '100%',
        backgroundColor: '#ddd',
        borderRadius: 6,
        marginBottom: 8,
    },
    lineShort: {
        height: 14,
        width: '80%',
        backgroundColor: '#ddd',
        borderRadius: 6,
    },
});

export default SkeletonPremiumQuestionCard;
