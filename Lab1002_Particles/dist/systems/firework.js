import { TAU } from "../utils.js";
import Vec2D from "../vec2d.js";
import Body from "./body.js";
import Particle from "./particle.js";
export default class Firework extends Body {
    detonationHeight;
    constructor(params) {
        super({ radius: 10, color: params.color, position: params.position });
        this.detonationHeight = params.detonationHeight;
        this.velocity = Vec2D.J.mult((this.detonationHeight - this.position.y) / 1);
        this.acceleration = Vec2D.J.mult((-0.99 * this.velocity.magSq()) /
            (2 * (this.detonationHeight - this.position.y)));
    }
    update(deltaTime, environment, newAcceleration) {
        super.update(deltaTime, environment, this.acceleration);
    }
    applyBehaviors(environment, envWidth, envHeight) {
        if (this.position.y <= this.detonationHeight || this.velocity.y > 0) {
            const index = environment.indexOf(this);
            if (index === -1) {
                console.log("firework not in ev");
                return;
            }
            environment.splice(index, 1);
            const layers = 10;
            const particlesPerLayer = 20;
            const dTheta = TAU / particlesPerLayer;
            for (let j = 0; j < particlesPerLayer; ++j) {
                for (let i = 0; i < layers; ++i) {
                    const deviation = Math.random() - 0.5;
                    environment.push(new Particle({
                        radius: 5,
                        lifeSpan: 1 * 1000,
                        colorEffect: (p, c) => c.setA(p > 0.9 ? 1 - 10 * (p - 0.9) : 1),
                        position: this.position,
                        velocity: Vec2D.fromAngle(dTheta * (j + deviation), 150 + 2 * i),
                        acceleration: Vec2D.J.mult(100),
                        color: this.color,
                    }));
                }
            }
        }
    }
}
