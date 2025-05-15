import React from 'react';
import { Image } from 'react-native';

export const Obstacle = ({ body }) => {
    const width = 70, height = 70;
    const x = body.position.x - width / 2;
    const y = body.position.y - height / 2;

    return (
        <Image
            source={require('../../../../../../assets/game/piedra_p.png')}
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
