import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CoinsDisplay from '../components/CoinsDisplay';
import ProfileImage from "../components/ProfileImage";
import StreakDisplay from "../components/StreakDisplay";

const TopBar = ({ coins }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.topBar}>
            <StatusBar backgroundColor="#2faaf6" barStyle="light-content" />
            <CoinsDisplay coins={coins} />
            <StreakDisplay streak={5} />
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
