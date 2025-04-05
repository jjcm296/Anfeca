import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const CoinsDisplay = ({ coins }) => {
    return (
        <View style={styles.container}>
            <Image source={require('../../../images/Coins_bueno.png')} style={styles.coinImage} />
            <Text style={styles.coinText}>{coins}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
    },
    coinImage: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    coinText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000000',
        marginLeft: 2,
    },
});

export default CoinsDisplay;
