import Vec2D from "../vec2d.js";
import Body from "./body.js";
import SpaceShip from "./spaceship.js";
export default class Planet extends Body {
    constructor(params) {
        super(params);
    }
    update(deltaTime, environment, envWidth, envHeight, newAcceleration) {
        const distanceToRepell = 4 * this.radius, distanceToTeleport = this.radius;
        let newVel = new Vec2D();
        for (let i = 0; i < environment.length; ++i) {
            if (environment[i] instanceof SpaceShip) {
                const ss = environment[i];
                const dist = ss.position.dist(this.position);
                if (dist <= distanceToTeleport + ss.radius) {
                    this.position = new Vec2D(Math.random() * envWidth, Math.random() * envHeight);
                }
                else if (dist <= distanceToRepell) {
                    newVel = newVel.add(ss.velocity).limit(SpaceShip.maxVel * 2 / 3);
                }
            }
        }
        this.velocity = newVel;
        super.update(deltaTime, environment, envWidth, envHeight);
    }
}
