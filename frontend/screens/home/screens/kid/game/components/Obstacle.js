import React from 'react';
import { View } from 'react-native';

export const Obstacle = ({ body }) => {
    const width = 40, height = 40;
    const x = body.position.x - width / 2;
    const y = body.position.y - height / 2;

    return (
        <View style={{
            position: 'absolute',
            width,
            height,
            backgroundColor: 'black',
            left: x,
            top: y
        }} />
    );
};
