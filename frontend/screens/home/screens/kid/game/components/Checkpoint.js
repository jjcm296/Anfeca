import React from 'react';
import { View, Text } from 'react-native';

export const Checkpoint = ({ body, isActive = true }) => {
    const width = 40;
    const height = 40;

    // Si el body ya no existe (fue eliminado del mundo físico)
    const x = body?.position?.x != null ? body.position.x - width / 2 : 0;
    const y = body?.position?.y != null ? body.position.y - height / 2 : 0;

    const backgroundColor = isActive ? 'orange' : '#666';
    const textColor = isActive ? 'white' : '#ccc';

    return (
        <View style={{
            position: 'absolute',
            width,
            height,
            backgroundColor,
            borderRadius: 8,
            borderWidth: 2,
            borderColor: '#fff',
            left: x,
            top: y,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 5,
        }}>
            <Text style={{ color: textColor, fontWeight: 'bold', fontSize: 24 }}>?</Text>
        </View>
    );
};
