import Matter from 'matter-js';
import { getSpeed, resetSpeed, setSpeed } from './GameConfig';

export const Physics = (entities, { time, dispatch, events }) => {
    const engine = entities.physics.engine;
    Matter.Engine.update(engine, time.delta);

    const maxUpwardSpeed = -10;
    const charVelocity = entities.character.body.velocity;
    if (charVelocity.y < maxUpwardSpeed) {
        Matter.Body.setVelocity(entities.character.body, {
            x: charVelocity.x,
            y: maxUpwardSpeed
        });
    }

    for (let e of events) {
        if (e.type === 'jump') {
            const velocity = entities.character.body.velocity;
            const strength = Math.min(e.strength || 1, 10);
            if (Math.abs(velocity.y) < 1) {
                const jumpForce = -8 - strength * 1.1;
                Matter.Body.setVelocity(entities.character.body, {
                    x: velocity.x,
                    y: jumpForce,
                });
            }
        }

        if (e.type === 'spawn-coin') {
            const activeCoins = Object.keys(entities).filter(key => key.startsWith('coin-')).length;
            if (activeCoins === 0) {
                const yPos = Math.random() * 100 + 220;
                const coin = Matter.Bodies.circle(1300, yPos, 15, {
                    isStatic: true,
                    label: 'coin',
                });
                const coinId = `coin-${Date.now()}`;
                Matter.World.add(entities.physics.world, [coin]);
                entities[coinId] = {
                    body: coin,
                    renderer: require('./components/Coin').Coin,
                };
            }
        }

        if (e.type === 'increase-speed') {
            const current = getSpeed();
            if (current < 10) setSpeed(current + 0.05);
        }

        if (e.type === 'resume-after-checkpoint') {
            Matter.Body.setVelocity(entities.character.body, { x: getSpeed(), y: 0 });
        }
    }

    // Mover obstáculo principal
    Matter.Body.translate(entities.obstacle.body, { x: -getSpeed(), y: 0 });

    // Mover y limpiar monedas y checkpoints (no la meta)
    Object.keys(entities).forEach((key) => {
        if (key.startsWith('coin-') || key.startsWith('checkpoint-')) {
            const obj = entities[key];
            Matter.Body.translate(obj.body, { x: -getSpeed(), y: 0 });

            if (obj.body.position.x < -30) {
                Matter.World.remove(entities.physics.world, obj.body);
                delete entities[key];
            }
        }

        // Mover la meta (finish-line) pero no eliminarla
        if (key === 'finish-line') {
            Matter.Body.translate(entities['finish-line'].body, { x: -getSpeed(), y: 0 });
        }
    });

    // Reiniciar obstáculo si sale de pantalla
    if (entities.obstacle.body.position.x < -30) {
        Matter.Body.setPosition(entities.obstacle.body, { x: 960, y: 288 });
        dispatch({ type: 'score' });
    }

    // Agregar colisiones solo una vez
    if (!engine.checkpointHandlerAdded) {
        Matter.Events.on(engine, 'collisionStart', (event) => {
            for (let pair of event.pairs) {
                const bodyA = pair.bodyA;
                const bodyB = pair.bodyB;

                const isCharacterA = bodyA.label === 'character';
                const isCharacterB = bodyB.label === 'character';

                // Colisión con obstáculo
                if ((isCharacterA && bodyB.label === 'obstacle') || (isCharacterB && bodyA.label === 'obstacle')) {
                    const obstacleBody = bodyA.label === 'obstacle' ? bodyA : bodyB;
                    obstacleBody.isSensor = true;
                    resetSpeed();
                    dispatch({ type: 'game-over' });
                }

                // Colisión con moneda
                if ((isCharacterA && bodyB.label === 'coin') || (isCharacterB && bodyA.label === 'coin')) {
                    const coinBody = bodyA.label === 'coin' ? bodyA : bodyB;
                    const coinId = Object.keys(entities).find(key => entities[key]?.body === coinBody);
                    if (coinId && entities[coinId]) {
                        Matter.World.remove(entities.physics.world, entities[coinId].body);
                        delete entities[coinId];
                        dispatch({ type: 'coin-collected', coinId });
                    }
                }

                // Colisión con checkpoint
                const isCheckpointA = bodyA.label?.startsWith('checkpoint-');
                const isCheckpointB = bodyB.label?.startsWith('checkpoint-');

                if ((isCharacterA && isCheckpointB) || (isCharacterB && isCheckpointA)) {
                    const checkpointBody = isCheckpointA ? bodyA : bodyB;
                    const checkpointId = checkpointBody.label;
                    const checkpointEntity = entities[checkpointId];
                    if (checkpointEntity && !checkpointEntity.used && checkpointEntity.isActive) {
                        dispatch({ type: 'checkpoint-hit', id: checkpointId });
                    }
                }

                // Colisión con finish-line
                if ((isCharacterA && bodyB.label === 'finish-line') || (isCharacterB && bodyA.label === 'finish-line')) {
                    dispatch({ type: 'game-won' });
                }
            }
        });

        engine.checkpointHandlerAdded = true;
    }

    entities.state = { currentSpeed: getSpeed() };
    return entities;
};