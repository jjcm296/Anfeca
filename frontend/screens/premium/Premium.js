import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Premium = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Premium Section</Text>
            <Text>Exclusive content and features for premium users.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default Premium;
