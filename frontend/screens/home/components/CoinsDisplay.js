import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const CoinsDisplay = ({ coins }) => {
    return (
        <View style={styles.container}>
            <FontAwesome5 name="coins" size={20} color="#FFD700" />
            <Text style={styles.coinText}>{coins}</Text>
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
    coinText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
        marginLeft: 5,
    },
});

export default CoinsDisplay;
