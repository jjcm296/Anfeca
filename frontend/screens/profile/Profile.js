import React from 'react';
import { View, StyleSheet, StatusBar, FlatList } from 'react-native';
function RewardsStack() {
    return (
        <View style={{ flex: 1 }}>
            <TopBar coins={100} streak={5} />
            <RewardsScreen />
        </View>
    );
}

const Profile = () => {
    return (
        <View style={styles.container}>
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

export default Profile;
