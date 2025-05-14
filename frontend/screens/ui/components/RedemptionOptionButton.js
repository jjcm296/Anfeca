import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const RedemptionOptionButton = ({ text, selected, onPress }) => {
    return (
        <TouchableOpacity
            style={[styles.button, selected && styles.buttonSelected]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Text style={[styles.text, selected && styles.textSelected]}>
                {text}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#f0f0f0',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    buttonSelected: {
        backgroundColor: '#3E9697',
        elevation: 4,
    },
    text: {
        fontSize: 14,
        color: '#333',
        fontWeight: '600',
    },
    textSelected: {
        color: '#fff',
    },
});

export default RedemptionOptionButton;
