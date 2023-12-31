import { Color, TAU } from "../utils.js";
import Vec2D from "../vec2d.js";
export default class Snake {
    segments;
    radius;
    colorPattern;
    velocity;
    speed;
    constructor(params) {
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
    update(deltaTime, environment) {
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
    applyBehaviors(environment, envWidth, envHeight) {
        // In future, maybe add segments
        // Bounce off walls
        if (this.segments[0].x - this.radius < 0) {
            this.segments[0] = this.segments[0].setX((x) => this.radius);
            this.velocity = this.velocity.setX((x) => -x);
        }
        else if (this.segments[0].x + this.radius > envWidth) {
            this.segments[0] = this.segments[0].setX((x) => envWidth - this.radius);
            this.velocity = this.velocity.setX((x) => -x);
        }
        if (this.segments[0].y - this.radius < 0) {
            this.segments[0] = this.segments[0].setY((y) => this.radius);
            this.velocity = this.velocity.setY((y) => -y);
        }
        else if (this.segments[0].y + this.radius > envHeight) {
            this.segments[0] = this.segments[0].setY((y) => envHeight - this.radius);
            this.velocity = this.velocity.setY((y) => -y);
        }
    }
    render(canvas) {
        const ctx = canvas.getContext("2d");
        if (!ctx)
            return;
        for (let i = this.segments.length - 1; i >= 0; --i) {
            const segment = this.segments[i];
            ctx.fillStyle =
                this.colorPattern[i % this.colorPattern.length].toString();
            ctx.beginPath();
            ctx.arc(segment.x, segment.y, this.radius, 0, TAU);
            ctx.fill();
        }
    }
    get mass() {
        return Math.PI * this.radius ** 2 * this.segments.length;
    }
    get position() {
        return this.segments[0];
    }
}
