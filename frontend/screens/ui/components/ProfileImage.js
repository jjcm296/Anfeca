import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

const defaultProfileImage = require('../../../assets/sinPerfil.png'); // Ruta de la imagen predeterminada

const ProfileImage = ({ source, width = 80, height = 80, borderRadius = 20, style }) => {
    return (
        <View style={[styles.container, { width, height, borderRadius }, style]}>
            <Image
                source={source || defaultProfileImage}
                style={[
                    styles.profileImage,
                    { width: width * 0.8, height: height * 0.8, borderRadius: borderRadius * 0.8 } // Hace la imagen un 80% más chica
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
        width:40,
        
    },
});

export default ProfileImage;
