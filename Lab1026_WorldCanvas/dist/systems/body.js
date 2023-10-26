import System from "../system.js";
import Vec2D from "../vec2d.js";
import { mod, TAU, Color } from "../utils.js";
export default class Body extends System {
    position;
    velocity;
    acceleration;
    mass;
    radius;
    onWallCollision;
    color;
    constructor(params) {
        super();
        this.radius = params.radius;
        this.mass = params.mass ?? Math.PI * this.radius ** 2;
        this.position = params.position ?? new Vec2D();
        this.velocity = params.velocity ?? new Vec2D();
        this.acceleration = params.acceleration ?? new Vec2D();
        this.onWallCollision = params.onWallCollision ?? "bounce";
        this.color = params.color ?? new Color();
    }
    update(deltaTime, environment, envWidth, envHeight, newAcceleration) {
        const newAcc = newAcceleration ?? new Vec2D();
        this.position = this.position
            .add(this.velocity.mult(deltaTime))
            .add(this.acceleration.mult(deltaTime ** 2 * 0.5));
        this.velocity = this.velocity.add(this.acceleration.add(newAcc).mult(deltaTime * 0.5));
        this.acceleration = newAcc;
    }
    applyForces(systems, forces) {
        const systemInteractions = systems ?? [];
        const forceInteractions = forces ?? [];
        const G = 6.6743e-11;
        // Force
        let f = new Vec2D();
        for (const system of systemInteractions) {
            if (this === system)
                continue;
            f = f.add(system.position
                .sub(this.position)
                .setMagnitude((G * system.mass * this.mass) /
                this.position.dist(system.position) ** 2));
        }
        for (const force of forceInteractions) {
            f = f.add(force);
        }
        return f.div(this.mass);
    }
    applyBehaviors(environment, deltaTime, envWidth, envHeight) {
        if (this.onWallCollision === "modulus") {
            this.position = this.position
                .setX((x) => mod(x, envWidth))
                .setY((y) => mod(y, envHeight));
            return;
        }
        if (this.position.x - this.radius < 0) {
            this.position = this.position.setX((x) => this.radius);
            this.velocity = this.velocity.setX((x) => -x);
        }
        else if (this.position.x + this.radius > envWidth) {
            this.position = this.position.setX((x) => envWidth - this.radius);
            this.velocity = this.velocity.setX((x) => -x);
        }
        if (this.position.y - this.radius < 0) {
            this.position = this.position.setY((y) => this.radius);
            this.velocity = this.velocity.setY((y) => -y);
        }
        else if (this.position.y + this.radius > envHeight) {
            this.position = this.position.setY((y) => envHeight - this.radius);
            this.velocity = this.velocity.setY((y) => -y);
        }
    }
    render(main, mini) {
        // Minimap
        mini.context.save();
        mini.context.fillStyle = this.color.toString();
        mini.context.scale(mini.dimensions.w / main.dimensions.w, mini.dimensions.h / main.dimensions.h);
        mini.context.translate(this.position.x, this.position.y);
        mini.context.beginPath();
        mini.context.arc(0, 0, this.radius, 0, TAU);
        mini.context.fill();
        mini.context.restore();
        // Regular
        main.context.save();
        main.context.fillStyle = this.color.toString();
        main.context.scale(main.dimensions.w / mini.dimensions.w, main.dimensions.h / mini.dimensions.h);
        main.context.translate(-mini.dimensions.x, -mini.dimensions.y);
        main.context.beginPath();
        main.context.arc(this.position.x, this.position.y, this.radius, 0, TAU);
        main.context.fill();
        main.context.restore();
    }
}
