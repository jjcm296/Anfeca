import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const RewardCard = ({ name, coins, expiration, color = '#FFFFFF' }) => {
    return (
        <View style={[styles.card, { backgroundColor: color }]}>
            {/* Contenedor de la información */}
            <View style={styles.leftContainer}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.expirationText}>
                    {expiration === 0 ? 'Expirado' : `${expiration} canjes`}
                </Text>
            </View>

            {/* Contenedor de las monedas alineado a la izquierda */}
            <View style={styles.coinContainer}>
                <Image source={require('../../../images/Coins_bueno.png')} style={styles.coinImage} />
                <Text style={styles.coinText}>{coins}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        overflow: 'hidden',
        marginVertical: 5,
        padding: 10,
        justifyContent: 'space-between',
    },
    leftContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    name: {
        fontSize: 19,
        fontWeight: '500',
        color: '#000',
    },
    expirationText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#555',
        marginTop: 2,
    },
    coinContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: 60,
    },
    coinImage: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
        marginRight: 5,
    },
    coinText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
});

export default RewardCard;
