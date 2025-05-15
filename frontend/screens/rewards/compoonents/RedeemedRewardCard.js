import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const RedeemedRewardCard = ({ rewardName, kidName, price, redeemDate, onConfirm }) => {
    return (
        <View style={styles.card}>
            <View style={styles.leftContainer}>
                <Text style={styles.name}>{rewardName}</Text>
                <Text style={styles.details}>Fecha: {redeemDate}</Text>
            </View>

            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
                <Text style={styles.confirmText}>Confirmar</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        borderWidth: 1.5,
        borderColor: '#2f5c98',
    },
    leftContainer: {
        flex: 1,
        paddingRight: 12,
    },
    name: {
        fontSize: 19,
        fontWeight: '500',
        color: '#000',
    },
    details: {
        fontSize: 14,
        color: '#555',
        marginTop: 4,
    },
    coinRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    coinText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    coinLabel: {
        fontSize: 16,
        color: '#000',
        marginLeft: 4,
    },
    confirmButton: {
        backgroundColor: '#3E9697',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    confirmText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default RedeemedRewardCard;