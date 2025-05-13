import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustonButton from '../ui/components/CustomButton';
import { LinearGradient } from 'expo-linear-gradient';

const Authentication = () => {
    const navigation = useNavigation();

    return (
        <LinearGradient
            colors={['#2faaf6', '#ffffff']}
            style={styles.container}
        >
            <View style={styles.topSection}>
                <Image
                    source={require('../../assets/logo/Logo .png')}
                    style={styles.image}
                    resizeMode="contain"
                />
                <Text style={styles.text}>Bienvenido</Text>
            </View>

            <View style={styles.separator}>
                <CustonButton
                    text={"Iniciar Sesión"}
                    color={'#2faaf6'}
                    textColor={'#FFFFFF'}
                    onPress={() => navigation.navigate("Login")}
                />
                <CustonButton
                    text={"Registrarse"}
                    color={'#FFFFFF'}
                    textColor={'#2faaf6'}
                    borderColor={'#2faaf6'}
                    onPress={() => navigation.navigate("RegisterAccount")}
                />
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    topSection: {
        alignItems: 'center',
        marginTop: 80,
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 300,
    },
    separator: {
        width: '95%',
        height: '25%',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2f5c98',
    },
});

export default Authentication;
