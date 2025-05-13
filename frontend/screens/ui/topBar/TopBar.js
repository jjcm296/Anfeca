import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CoinsDisplay from '../components/CoinsDisplay';
import StreakDisplay from '../components/StreakDisplay';
import { ApiGetCoins, ApiGetStreaks } from '../../../api/UserStats';
import { SessionContext } from '../../../context/SessionContext';
import { ApiRefreshAccessToken } from "../../../api/ApiLogin";

const TopBar = () => {
    const navigation = useNavigation();
    const { session } = useContext(SessionContext);
    const [coins, setCoins] = useState(0);
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                await ApiRefreshAccessToken();
                const coinsRes = await ApiGetCoins();
                const streakRes = await ApiGetStreaks();
                if (coinsRes?.coins != null) setCoins(coinsRes.coins);
                if (streakRes?.streak != null) setStreak(streakRes.streak);
            } catch (error) {
            }
        };

        fetchStats();
    }, [session.profileType]);

    return (
        <View style={styles.topBar}>
            <StatusBar backgroundColor="#2faaf6" barStyle="light-content" />
            <CoinsDisplay coins={coins} />
            <StreakDisplay streak={streak} />
        </View>
    );
};

const styles = StyleSheet.create({
    topBar: {
        flexDirection: 'row',
        width: '100%',
        backgroundColor: '#2faaf6',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
});

export default TopBar;
