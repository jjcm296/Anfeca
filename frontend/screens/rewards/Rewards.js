import React from 'react';
import { View, StyleSheet, StatusBar, FlatList } from 'react-native';
import CoinsDisplay from '../stats/CoinsDisplay'; // Importar monedas
import StreakDisplay from '../stats/StreakDisplay'; // Importar racha

const Rewards = () => {
    return (
        <View style={styles.container}>
            {/* Contenedor superior para monedas y racha */}
            <View style={styles.topBar}>
                <CoinsDisplay coins={100} />  {/* Monedas a la izquierda */}
                <StreakDisplay streak={5} />  {/* Racha a la derecha */}
            </View>

            {/* Lista de tarjetas con separación */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, // Se ajusta a la pantalla
    },
    topBar: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginTop: StatusBar.currentHeight || 10, // Ajuste para la barra de estado sin que se desborde
        shadowOffset: { width: 0, height: 2 },
    },
});

export default Rewards;
