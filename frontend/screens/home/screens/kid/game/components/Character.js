import React from 'react';
import { View, Image } from 'react-native';

export const Character = ({ body }) => {
    const width = 50, height = 50;
    const x = body.position.x - width / 2;
    const y = body.position.y - height / 2;

    return (
        <Image
            source={require('../../../../../../images/Logo-png.png')}
            style={{
                position: 'absolute',
                width,
                height,
                left: x,
                top: y,
                resizeMode: 'contain'
            }}
        />
    );
};
