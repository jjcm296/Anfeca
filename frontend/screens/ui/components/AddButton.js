import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AddButton = ({ onPress, size = 50, color = "#FFF", backgroundColor = "#38DF5A" }) => {
    return (
        <TouchableOpacity
            style={[styles.button, { width: size, height: size, backgroundColor }]}
            onPress={onPress}
        >
            <Ionicons name="add" size={size * 0.6} color={color} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 15, // Para hacerlo circular
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute', // Para usarlo como botón flotante
        bottom: 20,
        right: 25,
        elevation: 5, // Sombra en Android
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 2, height: 2 },
        shadowRadius: 5,
    },
});

export default AddButton;
