import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Questions = ({ route }) => {
    const { category, questions } = route.params; // Recibe los parámetros de navegación

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Category: {category}</Text>
            <Text style={styles.subtitle}>Total Questions: {questions}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: 'gray',
    },
});

export default Questions;
