import React from 'react';
import { View, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CoinsDisplay from '../components/CoinsDisplay';
import ProfileImage from "../components/ProfileImage";
import StreakDisplay from "../components/StreakDisplay";

const TopBar = ({ coins }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.topBar}>
            <CoinsDisplay coins={coins} />
            <StreakDisplay streak={5}/>
        </View>
    );
};

const styles = StyleSheet.create({
    topBar: {
        flexDirection: 'row',
        width: '100%',
        backgroundColor: '#FFFFFF',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    profileContainer: {
        marginRight: 15,
    },
});

export default TopBar;
