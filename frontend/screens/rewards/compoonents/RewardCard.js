import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CoinIcon from '../../ui/components/CoinIcon';

const RewardCard = ({ name, coins, expiration, color = '#FFFFFF' }) => {
    return (
        <View style={[styles.card, { backgroundColor: color }]}>
            {/* Contenedor de la información */}
            <View style={styles.leftContainer}>
                <Text style={styles.name}>{name}</Text>
                <View style={styles.expirationBox}>
                    <Text style={styles.expirationText}>
                        {expiration === 0 ? 'Expirado' : `${expiration} canjes`}
                    </Text>
                </View>
            </View>

            {/* Contenedor de las monedas */}
            <View style={styles.coinContainer}>
                <CoinIcon size={24} />
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
        elevation: 3, // Sombra en Android
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
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
    expirationBox: {
        backgroundColor: '#000000', // Morado elegante
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 10,
        alignSelf: 'flex-start', // Tamaño adaptable al contenido
        marginTop: 5,
    },
    expirationText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#FFFFFF', // Texto blanco para contraste
    },
    coinContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: 60,
    },
    coinText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginLeft: 5,
    },
});

export default RewardCard;
