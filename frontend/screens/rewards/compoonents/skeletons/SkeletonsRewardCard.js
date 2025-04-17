import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const SkeletonRewardCard = () => {
    return (
        <View style={styles.wrapper}>
            <SkeletonPlaceholder enabled={false}>
                <View style={styles.card}>
                    <View style={styles.leftContainer}>
                        <View style={styles.name} />
                        <View style={styles.expirationBox} />
                    </View>
                    <View style={styles.coinContainer}>
                        <View style={styles.coinIcon} />
                        <View style={styles.coinText} />
                    </View>
                </View>
            </SkeletonPlaceholder>
        </View>
    );
};
//.
const styles = StyleSheet.create({
    wrapper: {
        marginVertical: 5,
        marginHorizontal: 5,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        elevation: 3,
        shadowRadius: 5,
    },
    card: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 10,
    },
    leftContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    name: {
        width: 140,
        height: 20,
        borderRadius: 4,
        backgroundColor: '#E0E0E0',
        marginBottom: 8,
    },
    expirationBox: {
        width: 100,
        height: 18,
        borderRadius: 10,
        backgroundColor: '#E0E0E0',
    },
    coinContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: 60,
    },
    coinIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#E0E0E0',
    },
    coinText: {
        width: 40,
        height: 16,
        borderRadius: 4,
        marginLeft: 6,
        backgroundColor: '#E0E0E0',
    },
});

export default SkeletonRewardCard;
