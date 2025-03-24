import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const RedemptionOptionButton = ({ selected, onPress, text }) => {
    return (
        <TouchableOpacity
            style={[styles.optionButton, selected && styles.optionButtonSelected]}
            onPress={onPress}
        >
            <Text style={styles.optionText}>{text}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    optionButton: {
        flex: 1,
        padding: 12,
        backgroundColor: '#DDD',
        borderRadius: 8,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    optionButtonSelected: {
        backgroundColor: '#6200EE',
    },
    optionText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default RedemptionOptionButton;
