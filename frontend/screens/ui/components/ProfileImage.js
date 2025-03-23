import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

const defaultProfileImage = require('../../../images/sinPerfil.png'); // Ruta de la imagen predeterminada

const ProfileImage = ({ source, width = 80, height = 80, borderRadius = 20, style }) => {
    return (
        <View style={[styles.container, { width, height, borderRadius }, style]}>
            <Image
                source={source || defaultProfileImage}
                style={[
                    styles.profileImage,
                    { width: width * 0.6, height: height * 0.6, borderRadius: borderRadius * 0.6 } // Reduce al 60% del tamaño original
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: '#E0E0E0', // Gris claro para el fondo
    },
    profileImage: {
        resizeMode: 'cover',
        backgroundColor: 'transparent',
    },
});

export default ProfileImage;
