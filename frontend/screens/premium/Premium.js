import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Premium = () => {
    return (
        <LinearGradient colors={['#2faaf6', '#ffffff']} style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Premium Section</Text>
                <Text style={styles.text}>
                    Exclusive content and features for premium users.
                </Text>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2f5c98',
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        textAlign: 'center',
        color: '#333',
    },
});

export default Premium;
