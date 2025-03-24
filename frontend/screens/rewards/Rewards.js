import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RewardCard from './compoonents/RewardCard';
import FakeDataBase from '../../fakeDataBase/FakeDataBase';
import AddButton from '../ui/components/AddButton';
import AddReward from "./screens/AddReward";

const Rewards = () => {
    const navigation = useNavigation(); // 👈 Solución para usar navigation
    const rewards = FakeDataBase.getRewards();

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
            <AddButton onPress={() => navigation.navigate('AddReward')} />
        </View>
    );
};


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

export default Rewards;
