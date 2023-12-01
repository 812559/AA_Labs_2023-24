import Vec2D from "../vec2d.js";
import Body from "./body.js";
export default class Flocker extends Body {
    static maxVel = 100;
    static maxForce = 100;
    static neighborDistance = 100;
    constructor(params) {
        super(params);
    }
    update(deltaTime, environment, world, newAcceleration) {
        const forces = this.separate(environment).mult(10000)
            //    .add(this.cohere(environment).mult(1))
            .add(this.align(environment).mult(1));
        //    .div(3 * this.mass);
        super.update(deltaTime, environment, world, forces);
        this.velocity = this.velocity.limit(Flocker.maxVel);
    }
    separate(others) {
        let separation = new Vec2D();
        let count = 0;
        for (const system of others) {
            if (!(system instanceof Flocker) || system == this)
                continue;
            const actualDistance = this.position.dist(system.position);
            const minDistance = (this.radius + system.radius);
            if (actualDistance < minDistance && actualDistance != 0) {
                const difference = this.position.sub(system.position)
                    .setMagnitude(1 / actualDistance);
                separation = separation.add(difference);
                ++count;
            }
        }
        return count > 0 ? separation.div(count) : new Vec2D();
    }
    align(others) {
        let sum = new Vec2D();
        let count = 0;
        for (const system of others) {
            if (system instanceof Flocker &&
                system.position.dist(this.position) < Flocker.neighborDistance) {
                sum = sum.add(system.velocity);
                ++count;
            }
        }
        sum = sum.div(count)
            .setMagnitude(Flocker.maxVel);
        let steer = sum.sub(this.velocity);
        steer.limit(Flocker.maxForce);
        return steer;
    }
    cohere(others) {
        let sum = new Vec2D();
        let count = 0;
        for (const system of others) {
            if (this == system || !(system instanceof Flocker))
                continue;
            const distance = this.position.dist(system.position);
            if (distance > Flocker.neighborDistance)
                continue;
            sum = sum.add(system.position);
            ++count;
        }
        return count > 0 ? sum.div(count) : new Vec2D();
    }
    seek(other) {
        let desired = this.position.sub(other)
            .setMagnitude(Flocker.maxVel);
        let steer = desired.sub(this.velocity)
            .setMagnitude(Flocker.maxForce);
        return steer;
    }
}
