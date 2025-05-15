import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const CustomButton = ({ color = '#FFFFFF', text, onPress, disabled = false, textColor = '#000000' }) => {
    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor: disabled ? '#B0B0B0' : color }]}
            onPress={onPress}
            disabled={disabled}
        >
            <Text style={[styles.buttonText, { color: textColor }]}>{text}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default CustomButton;
