import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import RewardCard from './compoonents/RewardCard';
import AddButton from '../ui/components/AddButton';
import { ApiRefreshAccessToken } from "../../api/ApiLogin";
import { getAllRewards } from "../../api/ApiRewards";

import SkeletonRewardCard from './compoonents/skeletons/SkeletonsRewardCard';

const Rewards = () => {
    const navigation = useNavigation();
    const [rewards, setRewards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);

    const fetchRewards = async () => {
        try {
            setLoading(true);
            await ApiRefreshAccessToken();
            const response = await getAllRewards();

            setRewards(response.rewardsArray);
            setHasLoaded(true);
            setLoading(false);
            console.log("Rewards:", response);
        } catch (error) {
            console.error("Error fetching rewards:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRewards();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;

            const loadRewards = async () => {
                try {
                    await ApiRefreshAccessToken();
                    const response = await getAllRewards();
                    if (isActive) {
                        setRewards(response.rewardsArray);
                        setHasLoaded(true);
                        setLoading(false);
                    }
                } catch (error) {
                    if (isActive) {
                        console.error("Error fetching rewards:", error);
                        setLoading(false);
                    }
                }
            };

            setLoading(true);
            loadRewards();

            return () => {
                isActive = false;
            };
        }, [])
    );


    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.list}>
                    {[1, 2, 3, 4, 5].map((_, index) => (
                        <SkeletonRewardCard key={index} />
                    ))}
                </View>
            ) : (
                <FlatList
                    data={rewards}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate("EditReward", { rewardId: item._id })}
                        >
                            <RewardCard
                                name={item.name}
                                coins={item.price}
                                type={item.type}
                                redemptionLimit={item.redemptionLimit ?? 0}
                                redemptionCount={item.redemptionCount ?? 0}
                            />
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={styles.list}
                />
            )}

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
