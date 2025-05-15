import Matter from 'matter-js';
import { Character } from './components/Character';
import { Obstacle } from './components/Obstacle';

let currentSpeed = 3;
const MAX_SPEED = 15;
const SPEED_INCREMENT = 0.2;

export const getEntities = (dispatch) => {
    const engine = Matter.Engine.create({ enableSleeping: false });
    const world = engine.world;

    const character = Matter.Bodies.rectangle(100, 288, 50, 50, {
        label: 'character',
        restitution: 0.1,
        friction: 1,
    });

    const obstacle = Matter.Bodies.rectangle(800, 288, 40, 40, {
        label: 'obstacle',
        isStatic: true,
    });

    const ground = Matter.Bodies.rectangle(480, 338, 960, 60, {
        label: 'ground',
        isStatic: true,
        render: { visible: false }
    });

    Matter.World.add(world, [character, obstacle, ground]);

    return {
        physics: { engine, world },
        character: { body: character, renderer: Character },
        obstacle: { body: obstacle, renderer: Obstacle },
        ground: { body: ground, renderer: () => null },
        state: { currentSpeed },
    };
};
