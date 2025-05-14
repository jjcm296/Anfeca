import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const FinishLine = ({ body }) => {
    const width = 20;
    const height = 150;
    const x = body?.position?.x != null ? body.position.x - width / 2 : 0;
    const y = body?.position?.y != null ? body.position.y - height / 2 : 0;

    return (
        <View style={[styles.container, { left: x, top: y }]}>
            <View style={styles.pole} />
            <View style={styles.flag}>
                <Text style={styles.text}>🏁</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: 40,
        height: 150,
        alignItems: 'center',
    },
    pole: {
        width: 4,
        height: 150,
        backgroundColor: '#333',
    },
    flag: {
        position: 'absolute',
        top: 0,
        left: 4,
        backgroundColor: '#FF3D3D',
        padding: 4,
        borderTopRightRadius: 6,
        borderBottomRightRadius: 6,
    },
    text: {
        fontSize: 20,
        color: '#fff',
    },
});

export default FinishLine;
