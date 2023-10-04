import Vec2D from "./vec2d.js";
import { Utils } from "./utils.js";
export default class Mover {
    position_;
    velocity_;
    acceleration_;
    radius_;
    mass_;
    get position() {
        return this.position_;
    }
    get velocity() {
        return this.velocity_;
    }
    get acceleration() {
        return this.acceleration_;
    }
    get radius() {
        return this.radius_;
    }
    get mass() {
        return this.mass_;
    }
    constructor(options) {
        this.position_ = options.position ?? new Vec2D();
        this.velocity_ = options.velocity ?? new Vec2D();
        this.acceleration_ = options.acceleration ?? new Vec2D();
        this.radius_ = options.radius;
        this.mass_ = options.mass ?? Math.PI * this.radius_ ** 2;
    }
    update(deltaTime, newAcceleration = new Vec2D()) {
        // Verlet integration: https://en.wikipedia.org/wiki/Verlet_integration
        this.position_ = this.position_
            .add(this.velocity_.mult(deltaTime))
            .add(this.acceleration_.mult(deltaTime ** 2 * 0.5));
        this.velocity_ = this.velocity_.add(this.acceleration_.add(newAcceleration).mult(deltaTime * 0.5));
        this.acceleration_ = newAcceleration;
    }
    applyForces(movers, forces) {
        const G = 6.6743e-11;
        // Force
        let f = new Vec2D();
        for (const mover of movers) {
            if (this !== mover)
                f = f.add(mover.position_
                    .sub(this.position_)
                    .setMagnitude((G * mover.mass * this.mass) /
                    this.position_.dist(mover.position_) ** 2));
        }
        if (forces)
            for (const force of forces)
                f = f.add(force);
        // F = ma -> a = F/m
        return f.div(this.mass);
    }
    checkWalls(width, height, bounce = true) {
        if (!bounce) {
            this.position_ = this.position_
                .setX((x) => Utils.mod(x, width))
                .setY((y) => Utils.mod(y, height));
            return;
        }
        if (this.position_.x - this.radius_ < 0) {
            this.position_ = this.position_.setX((x) => this.radius_);
            this.velocity_ = this.velocity_.setX((x) => -x);
        }
        else if (this.position_.x + this.radius_ > width) {
            this.position_ = this.position_.setX((x) => width - this.radius_);
            this.velocity_ = this.velocity_.setX((x) => -x);
        }
        if (this.position_.y - this.radius_ < 0) {
            this.position_ = this.position_.setY((y) => this.radius_);
            this.velocity_ = this.velocity_.setY((y) => -y);
        }
        else if (this.position_.y + this.radius_ > height) {
            this.position_ = this.position_.setY((y) => height - this.radius_);
            this.velocity_ = this.velocity_.setY((y) => -y);
        }
    }
    limitVelocity(maxMagnitude) {
        this.velocity_ = this.velocity_.limit(maxMagnitude);
    }
    render(canvas, color = "black", modulus = false) {
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            console.log('Could get a "2d" context from ', canvas);
            return false;
        }
        const x = (modulus ? Utils.mod : (x, y) => x)(this.position_.x, canvas.width);
        const y = (modulus ? Utils.mod : (x, y) => x)(this.position_.y, canvas.height);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, this.radius_, 0, 2 * Math.PI);
        ctx.fill();
        return true;
    }
}
