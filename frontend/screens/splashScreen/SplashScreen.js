import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';

export default function SplashScreen() {
    const navigation = useNavigation();
    const progress = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const checkSession = async () => {
            const token = await SecureStore.getItemAsync('accessToken');

            Animated.timing(progress, {
                toValue: 1,
                duration: 5000,
                useNativeDriver: false,
            }).start(() => {
                if (token) {
                    navigation.replace('MainTabs');
                } else {
                    navigation.replace('Authentication');
                }
            });
        };

        checkSession();
    }, []);

    const widthInterpolated = progress.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <LinearGradient colors={['#2faaf6', '#ffffff']} style={styles.container}>
            <View style={styles.innerContainer}>
                <Image
                    source={require('../../assets/mascota/fox_run.gif')}
                    style={styles.image}
                    resizeMode="contain"
                />
                <Text style={styles.title}>ConcentraTDA</Text>
                <Text style={styles.subtitle}>Concentra tu mente, expande tu mundo</Text>

                <View style={styles.progressBarContainer}>
                    <Animated.View style={[styles.progressBar, { width: widthInterpolated }]} />
                </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerContainer: {
        width: '85%',
        alignItems: 'center',
    },
    image: {
        width: 160,
        height: 160,
        marginBottom: 20,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#1c3b70',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 14,
        color: '#3a3a3a',
        textAlign: 'center',
        marginBottom: 24,
    },
    progressBarContainer: {
        width: '100%',
        height: 10,
        backgroundColor: '#ffffff33',
        borderRadius: 20,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#f6ce4b',
    },
});
