import { Image as ExpoImage } from 'expo-image';

export const Character = ({ body }) => {
    const width = 80, height = 80;
    const x = body.position.x - width / 2;
    const y = body.position.y - height / 2;

    return (
        <ExpoImage
            source={require('../../../../../../assets/mascota/fox_run.gif')}
            style={{
                position: 'absolute',
                width,
                height,
                left: x,
                top: y,
            }}
            contentFit="contain"
        />
    );
};
