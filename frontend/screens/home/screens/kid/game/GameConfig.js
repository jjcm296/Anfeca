export let currentSpeed = 3;
export const MAX_SPEED = 10;
export const SPEED_INCREMENT = 0.05;

export const getSpeed = () => currentSpeed;

export const setSpeed = (value) => {
    currentSpeed = Math.min(value, MAX_SPEED);
};

export const resetSpeed = () => {
    currentSpeed = 3;
};
