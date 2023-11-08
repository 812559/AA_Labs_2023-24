import System from "../system.js";
import { Color, TAU } from "../utils.js";
import Vec2D from "../vec2d.js";
import Body from "./body.js";
export default class Snake extends System {
    segments;
    radius;
    colorPattern;
    velocity;
    speed;
    constructor(params) {
        super();
        this.colorPattern = params.colorPattern ?? [new Color()];
        this.segments = [];
        for (let i = 0; i < params.amountOfSegments; ++i)
            this.segments.push(params.headPosition);
        this.radius = params.radius;
        this.velocity =
            params.velocity?.setMagnitude(this.radius / 2) ??
                Vec2D.fromAngle(Math.random() * TAU, this.radius / 2);
        this.speed = params.speed ?? 1;
    }
    update(deltaTime, environment, world) {
        deltaTime *= this.speed;
        // All segments but the first
        for (let i = this.segments.length - 1; i > 0; --i) {
            this.segments[i] = this.segments[i].add(this.segments[i - 1].sub(this.segments[i]).mult(deltaTime));
        }
        // Update head
        if (Math.random() > 0.99)
            this.velocity = this.velocity.setAngle(this.velocity.angle() + (TAU / 10) * (Math.random() - 0.5));
        this.segments[0] = this.segments[0].add(this.velocity.mult(deltaTime));
    }
    applyBehaviors(environment, deltaTime, world) {
        // Add a segment
        for (let i = 0; i < environment.length; ++i) {
            if (!(environment[i] instanceof Body))
                continue;
            if (this.segments[0].dist(environment[i].position) <=
                this.radius + environment[i].radius) {
                this.segments.push(this.segments[this.segments.length - 1].copy());
                environment[i].removeFrom(environment);
            }
        }
        // Bounce off walls
        if (this.segments[0].x - this.radius < 0) {
            this.segments[0] = this.segments[0].setX((x) => this.radius);
            this.velocity = this.velocity.setX((x) => -x);
        }
        else if (this.segments[0].x + this.radius > world.w) {
            this.segments[0] = this.segments[0].setX((x) => world.w - this.radius);
            this.velocity = this.velocity.setX((x) => -x);
        }
        if (this.segments[0].y - this.radius < 0) {
            this.segments[0] = this.segments[0].setY((y) => this.radius);
            this.velocity = this.velocity.setY((y) => -y);
        }
        else if (this.segments[0].y + this.radius > world.h) {
            this.segments[0] = this.segments[0].setY((y) => world.h - this.radius);
            this.velocity = this.velocity.setY((y) => -y);
        }
    }
    render(cnv, world, renderArea) {
        for (let i = this.segments.length - 1; i >= 0; --i) {
            System.renderCircle(this.segments[i], this.colorPattern[i % this.colorPattern.length], this.radius, cnv, world, renderArea);
        }
    }
    get mass() {
        return Math.PI * this.radius ** 2 * this.segments.length;
    }
    get position() {
        return this.segments[0];
    }
}
