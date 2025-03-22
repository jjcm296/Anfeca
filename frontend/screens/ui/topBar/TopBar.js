import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import CoinsDisplay from '../components/CoinsDisplay';
import StreakDisplay from '../components/StreakDisplay';

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
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginTop: StatusBar.currentHeight || 10,
    },
});

export default TopBar;
