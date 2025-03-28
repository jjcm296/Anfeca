import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import CustonButton from '../ui/components/CustomButton';

const Authentication = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Bienvenido</Text>
            <View style={styles.separator} >

                <CustonButton
                    text={"Iniciar Sesión"}
                    color={'#000000'}
                    textColor={'#FFFFFF'}
                />
                <CustonButton
                    text={"Registrarse"}
                    onPress={() => navigation.navigate("RegisterAccount")}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    separator: {
        width: '95%',
        height: '25%',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
    }
});

export default Authentication;
