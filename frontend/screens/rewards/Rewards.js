import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RewardCard from './compoonents/RewardCard';
import FakeDataBase from '../../fakeDataBase/FakeDataBase';
import AddButton from '../ui/components/AddButton';

const Rewards = () => {
    const navigation = useNavigation();
    const rewards = FakeDataBase.getRewards();

    return (
        <View style={styles.container}>
            <FlatList
                data={rewards}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate('EditReward', { reward: item })}>
                        <RewardCard name={item.name} coins={item.coins} expiration={item.expiration} />
                    </TouchableOpacity>
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
