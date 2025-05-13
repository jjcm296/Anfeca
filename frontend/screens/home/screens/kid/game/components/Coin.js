import React from 'react';
import { Image } from 'react-native';

export const Coin = ({ body }) => {
    if (!body) return null; // ✅ Protección para evitar error

    const width = 30, height = 30;
    const x = body.position.x - width / 2;
    const y = body.position.y - height / 2;

    return (
        <Image
            source={require('../../../../../../images/Coins_bueno.png')}
            style={{
                position: 'absolute',
                width,
                height,
                left: x,
                top: y,
                resizeMode: 'contain',
            }}
        />
    );
};
