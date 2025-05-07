// Physics.js
import Matter from 'matter-js';

const Physics = (entities, { time, dispatch, events }) => {
    const engine = entities.physics.engine;
    Matter.Engine.update(engine, time.delta);

    for (let e of events) {
        if (e.type === 'jump') {
            Matter.Body.setVelocity(entities.character.body, { x: 0, y: -10 });
        }
    }

    Matter.Body.translate(entities.obstacle.body, { x: -5, y: 0 });

    if (entities.obstacle.body.position.x < -30) {
        Matter.Body.setPosition(entities.obstacle.body, { x: 400, y: 280 });
        dispatch({ type: 'score' });
    }

    Matter.Events.on(engine, "collisionStart", () => {
        dispatch({ type: "game-over" });
    });

    return entities;
};

export default Physics;
