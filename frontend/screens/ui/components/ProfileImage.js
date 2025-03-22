import React from 'react';
import { Image, StyleSheet } from 'react-native';

const ProfileImage = ({ source, width = 80, height = 80, borderRadius = 20 }) => {
    return (
        <Image
            source={source}
            style={[styles.profileImage, { width, height, borderRadius }]}
        />
    );
};

const styles = StyleSheet.create({
    profileImage: {
        backgroundColor: '#ccc',
    },
});

export default ProfileImage;
