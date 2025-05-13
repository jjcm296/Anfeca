import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const StreakDisplay = ({ streak }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.streakText}>{streak}</Text>
            <Ionicons name="flame" size={24} color="#FF4500" />
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
        fontSize: 19,
        fontWeight: 'bold',
        color: '#ffffff',
        marginLeft: 5,
    },

});

export default StreakDisplay;
