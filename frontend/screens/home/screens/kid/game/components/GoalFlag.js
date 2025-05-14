import React from 'react';
import { View } from 'react-native';

export const GoalFlag = ({ body }) => {
    const width = 40, height = 60;
    const x = body.position.x - width / 2;
    const y = body.position.y - height / 2;

    return (
        <View style={{
            position: 'absolute',
            width,
            height,
            left: x,
            top: y,
            backgroundColor: 'gold',
            borderWidth: 2,
            borderColor: 'black',
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <View style={{ width: 10, height: 40, backgroundColor: 'black' }} />
        </View>
    );
};
