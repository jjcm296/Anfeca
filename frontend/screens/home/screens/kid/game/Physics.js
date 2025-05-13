    import Matter from 'matter-js';
    import { getSpeed, resetSpeed, setSpeed } from './GameConfig';

    export const Physics = (entities, { time, dispatch, events }) => {
        const engine = entities.physics.engine;
        Matter.Engine.update(engine, time.delta);

        for (let e of events) {
            if (e.type === 'jump') {
                const velocity = entities.character.body.velocity;
                const strength = Math.min(e.strength || 1, 10);
                if (Math.abs(velocity.y) < 0.2) {
                    const jumpForce = -7 - strength * 1.1;
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

        // Mover y limpiar monedas y checkpoints
        Object.keys(entities).forEach((key) => {
            if (key.startsWith('coin-') || key.startsWith('checkpoint-')) {
                const obj = entities[key];
                Matter.Body.translate(obj.body, { x: -getSpeed(), y: 0 });

                if (obj.body.position.x < -30) {
                    Matter.World.remove(entities.physics.world, obj.body);
                    delete entities[key];
                }
            }
        });

        // Reiniciar obstáculo si sale de pantalla
        if (entities.obstacle.body.position.x < -30) {
            Matter.Body.setPosition(entities.obstacle.body, { x: 960, y: 310 });
            dispatch({ type: 'score' });
        }

        // Agregar colisión una sola vez
        if (!engine.checkpointHandlerAdded) {
            Matter.Events.on(engine, 'collisionStart', (event) => {
                for (let pair of event.pairs) {
                    const bodyA = pair.bodyA;
                    const bodyB = pair.bodyB;

                    const isCharacterA = bodyA.label === 'character';
                    const isCharacterB = bodyB.label === 'character';
                    const isObstacleA = bodyA.label === 'obstacle';
                    const isObstacleB = bodyB.label === 'obstacle';

                    if ((isCharacterA && isObstacleB) || (isCharacterB && isObstacleA)) {
                        const obstacleBody = isObstacleA ? bodyA : bodyB;
                        obstacleBody.isSensor = true;

                        resetSpeed();
                        dispatch({ type: 'game-over' });
                    }

                    const isCoinA = bodyA.label === 'coin';
                    const isCoinB = bodyB.label === 'coin';
                    if ((isCharacterA && isCoinB) || (isCharacterB && isCoinA)) {
                        const coinBody = isCoinA ? bodyA : bodyB;
                        const coinId = Object.keys(entities).find(key => entities[key]?.body === coinBody);
                        if (coinId && entities[coinId]) {
                            Matter.World.remove(entities.physics.world, entities[coinId].body);
                            delete entities[coinId];
                            dispatch({ type: 'coin-collected', coinId });
                        }
    }
                    const isCheckpointA = bodyA.label.startsWith('checkpoint-');
                    const isCheckpointB = bodyB.label.startsWith('checkpoint-');

                    if ((isCharacterA && isCheckpointB) || (isCharacterB && isCheckpointA)) {
                        const checkpointBody = isCheckpointA ? bodyA : bodyB;
                        const checkpointId = checkpointBody.label;
                        const checkpointEntity = entities[checkpointId];

                        if (checkpointEntity && !checkpointEntity.used && checkpointEntity.isActive) {
                            dispatch({ type: 'checkpoint-hit', id: checkpointId });
                        }
                    }
                }
            });

            engine.checkpointHandlerAdded = true;
        }

        entities.state = { currentSpeed: getSpeed() };
        return entities;
    };
