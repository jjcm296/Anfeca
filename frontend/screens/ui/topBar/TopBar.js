import React from 'react';
import { View, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CoinsDisplay from '../components/CoinsDisplay';
import ProfileImage from "../components/ProfileImage";

const TopBar = ({ coins }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.topBar}>
            <CoinsDisplay coins={coins} />
            <TouchableOpacity style={styles.profileContainer} onPress={() => navigation.navigate("Profile")}>
                <ProfileImage width={45} height={45} borderRadius={40} />
            </TouchableOpacity>
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
        marginTop: StatusBar.currentHeight || 10,
        paddingVertical: 5,
    },
    profileContainer: {
        marginRight: 15,
    },
});

export default TopBar;
