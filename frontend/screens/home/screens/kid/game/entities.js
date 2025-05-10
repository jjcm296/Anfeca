// entities.js
import Matter from 'matter-js';
import { Character } from './components/Character';
import { Obstacle } from './components/Obstacle';

export const getEntities = () => {
    const engine = Matter.Engine.create({ enableSleeping: false });
    const world = engine.world;

    const character = Matter.Bodies.rectangle(50, 280, 50, 50, { label: 'character' });
    const obstacle = Matter.Bodies.rectangle(400, 280, 60, 60, {
        label: 'obstacle',
        isStatic: true
    });

    const ground = Matter.Bodies.rectangle(200, 330, 400, 60, {
        label: 'ground',
        isStatic: true,
        render: { visible: false }
    });

    Matter.World.add(world, [character, obstacle, ground]);

    return {
        physics: { engine, world },
        character: { body: character, renderer: Character },
        obstacle: { body: obstacle, renderer: Obstacle },
        ground: { body: ground, renderer: () => null }, // invisible
    };
};
