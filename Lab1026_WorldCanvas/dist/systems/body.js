import System from "../system.js";
import Vec2D from "../vec2d.js";
import { mod, Color } from "../utils.js";
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
    update(deltaTime, environment, world, newAcceleration) {
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
    applyBehaviors(environment, deltaTime, world) {
        if (this.onWallCollision === "modulus") {
            this.position = this.position
                .setX((x) => mod(x, world.w))
                .setY((y) => mod(y, world.h));
            return;
        }
        if (this.position.x - this.radius < 0) {
            this.position = this.position.setX((x) => this.radius);
            this.velocity = this.velocity.setX((x) => -x);
        }
        else if (this.position.x + this.radius > world.w) {
            this.position = this.position.setX((x) => world.w - this.radius);
            this.velocity = this.velocity.setX((x) => -x);
        }
        if (this.position.y - this.radius < 0) {
            this.position = this.position.setY((y) => this.radius);
            this.velocity = this.velocity.setY((y) => -y);
        }
        else if (this.position.y + this.radius > world.h) {
            this.position = this.position.setY((y) => world.h - this.radius);
            this.velocity = this.velocity.setY((y) => -y);
        }
    }
    render(cnv, world, renderArea) {
        // const miniCtx = cnv.mini.getContext("2d")!;
        // const mainCtx = cnv.main.getContext("2d")!;
        // miniCtx.save();
        //     miniCtx.fillStyle = this.color.toString();
        //     miniCtx.scale(
        //         cnv.mini.width / world.w,
        //         cnv.mini.height / world.h,
        //     );
        //     miniCtx.translate(this.position.x, this.position.y);
        //     miniCtx.beginPath();
        //         miniCtx.arc(0, 0, this.radius, 0, TAU);
        //     miniCtx.fill();
        // miniCtx.restore();
        // mainCtx.save();
        //     mainCtx.fillStyle = this.color.toString();
        //     mainCtx.translate(
        //         this.position.x - renderArea.x,
        //         this.position.y - renderArea.y
        //     );
        //     mainCtx.beginPath();
        //         mainCtx.arc(0, 0, this.radius, 0, TAU);
        //     mainCtx.fill();
        // mainCtx.restore();
        System.renderCircle(this.position, this.color, this.radius, cnv, world, renderArea);
    }
}
