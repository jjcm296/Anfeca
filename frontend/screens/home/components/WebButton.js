import React, { useRef, useState } from 'react';
import { Animated, PanResponder, TouchableOpacity, Image, StyleSheet, Linking, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const WebButton = ({ url, imageSource }) => {
    const position = useRef(new Animated.ValueXY({ x: width - 90, y: height * 0.02 })).current;
    const [isDragging, setIsDragging] = useState(false);

    const handlePress = () => {
        if (!isDragging) {
            Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
        }
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                setIsDragging(true);
                position.setOffset({ x: position.x._value, y: position.y._value });
                position.setValue({ x: 0, y: 0 });
            },
            onPanResponderMove: (_, gesture) => {
                position.setValue({ x: gesture.dx, y: gesture.dy });
            },
            onPanResponderRelease: (_, gesture) => {
                setIsDragging(false);
                position.flattenOffset();

                let newX = gesture.moveX < width / 2 ? 10 : width - 90;
                let newY = Math.max(height * 0.02, Math.min(gesture.moveY, height - 250));
                // 🔥 newY:
                // - `height * 0.05` → Límite superior aún más arriba
                // - `height - 250` → Límite inferior antes del botón de agregar

                Animated.spring(position, {
                    toValue: { x: newX, y: newY },
                    useNativeDriver: false,
                }).start();
            },
        })
    ).current;

    return (
        <Animated.View
            style={[styles.button, { transform: position.getTranslateTransform() }]}
            {...panResponder.panHandlers}
        >
            <TouchableOpacity style={styles.touchable} onPress={handlePress} activeOpacity={isDragging ? 1 : 0.7}>
                {imageSource && <Image source={imageSource} style={styles.image} />}
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: 'transparent',
    },
    touchable: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '85%',
        resizeMode: 'contain',
    },
});

export default WebButton;
