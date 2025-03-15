import React from 'react';
import { Image, StyleSheet } from 'react-native';

const CoinIcon = ({ size = 24 }) => {
    return (
        <Image
            source={require('../../../images/Coins_bueno.png')}
            style={[styles.coinImage, { width: size, height: size }]}
            resizeMode="contain"
        />
    );
};

const styles = StyleSheet.create({
    coinImage: {
        width: 24,
        height: 24,
    }
});

export default CoinIcon;
