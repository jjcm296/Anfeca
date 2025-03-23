import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import RewardCard from '../rewards/compoonents/RewarCard'; // Asegúrate de que la ruta es correcta
import FakeDataBase from '../../fakeDataBase/FakeDataBase';

const Rewards = () => {
    const rewards = FakeDataBase.getRewards(); // Obtener las recompensas desde la base de datos

    return (
        <View style={styles.container}>
            <FlatList
                data={rewards}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                    <RewardCard name={item.name} coins={item.coins} expiration={item.expiration} />
                )}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

function RewardsStack() {
    return (
        <View style={{ flex: 1 }}>
            <Rewards />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    list: {
        paddingBottom: 20,
    },
});

export default RewardsStack;
