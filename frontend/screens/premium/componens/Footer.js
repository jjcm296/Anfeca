import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';

const Footer = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Síguenos</Text>
            <View style={styles.iconRow}>
                <TouchableOpacity onPress={() => Linking.openURL('https://www.instagram.com/concentratda?igsh=MTBjdjh6eDBxanNxZg%3D%3D&utm_source=qr')}>
                    <FontAwesome name="instagram" size={28} color="#2f5c98" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL('https://www.facebook.com/share/15K3BNLk4U/?mibextid=wwXIfr')}>
                    <FontAwesome name="facebook" size={28} color="#2f5c98" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL('https://www.tiktok.com/@concentratda?_t=ZS-8wKhs2Gu0bH&_r=1')}>
                    <FontAwesome5 name="tiktok" size={25} color="#2f5c98" />

                </TouchableOpacity>
            </View>

            <View style={styles.separator} />

            <Text style={styles.bottomText}>
                © 2025 Concentra TDA |{' '}
                <Text style={styles.link} onPress={() => {}}>Términos de uso</Text> |{' '}
                <Text style={styles.link} onPress={() => {}}>Política de privacidad</Text>
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        paddingBottom: 40,
        alignItems: 'center',
        marginTop: 40,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2f5c98',
        marginBottom: 10,
    },
    iconRow: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 20,
    },
    separator: {
        height: 1,
        width: '80%',
        backgroundColor: '#ccc',
        marginVertical: 10,
    },
    bottomText: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    link: {
        color: '#3E9697',
        textDecorationLine: 'underline',
    },
});

export default Footer;
