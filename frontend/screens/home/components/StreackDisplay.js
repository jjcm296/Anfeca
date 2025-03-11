import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const StreakDisplay = ({ streak }) => {
    return (
        <View style={styles.container}>
            <Ionicons name="flame" size={22} color="#FF4500" />
            <Text style={styles.streakText}>{streak}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    streakText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF4500',
        marginLeft: 5,
    },
});

export default StreakDisplay;
