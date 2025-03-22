import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CloseButton = ({ onPress, color = '#D3D3D3' }) => {
    return (
        <TouchableOpacity style={[styles.closeButton, { backgroundColor: color }]} onPress={onPress}>
            <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    closeButton: {
        position: 'absolute',
        top: 15,
        right: 10,
        width: 30,
        height: 30,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CloseButton;
