import React from 'react';
import { Image, StyleSheet } from 'react-native';

const ProfileImage = ({ source, width = 80, height = 80 }) => {
    return (
        <Image
            source={source}
            style={[styles.profileImage, { width, height}]} // Aplicamos borderRadius para redondear
        />
    );
};

const styles = StyleSheet.create({
    profileImage: {
        backgroundColor: '#ccc', // Fondo mientras se carga la imagen
        borderRadius: 20,
    },
});

export default ProfileImage;
