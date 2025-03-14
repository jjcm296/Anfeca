import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import CoinsDisplay from '../components/CoinsDisplay'; // Monedas
import StreakDisplay from '../components/StreakDisplay'; // Racha

const TopBar = ({ coins, streak }) => {
    return (
        <View style={styles.topBar}>
            <CoinsDisplay coins={coins} />
            <StreakDisplay streak={streak} />
        </View>
    );
};

const styles = StyleSheet.create({
    topBar: {
        flexDirection: 'row', // Alinea elementos en fila
        width: '100%', // Ocupa todo el ancho de la pantalla
        justifyContent: 'space-between', // Espacia los elementos en la fila
        alignItems: 'center', // Centra verticalmente
        paddingHorizontal: 10, // Agrega espacio a los lados
        paddingVertical: 5, // Agrega espacio arriba y abajo
        marginTop: StatusBar.currentHeight || 10, // Ajusta la posición debajo de la barra de estado
    },
});

export default TopBar;
