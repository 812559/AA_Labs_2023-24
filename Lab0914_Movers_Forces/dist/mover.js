import Vec2D from "./vec2d.js";
import { Utils } from "./utils.js";
export default class Mover {
    position_;
    velocity_;
    acceleration_;
    radius_;
    hasCollided = false;
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
        return 2 * Math.PI * this.radius_;
    }
    constructor(options) {
        this.position_ = options.position ?? new Vec2D;
        this.velocity_ = options.velocity ?? new Vec2D;
        this.acceleration_ = options.acceleration ?? new Vec2D;
        this.radius_ = options.radius;
    }
    update(deltaTime, newAcceleration = new Vec2D) {
        // Verlet integration: https://en.wikipedia.org/wiki/Verlet_integration
        this.position_ = this.position_
            .add(this.velocity_.mult(deltaTime))
            .add(this.acceleration_.mult(deltaTime ** 2 * 0.5));
        this.velocity_ = this.velocity_
            .add(this.acceleration_.add(newAcceleration).mult(deltaTime * 0.5));
        this.acceleration_ = newAcceleration;
    }
    applyForces(otherMovers) {
        let acc = new Vec2D;
        const G = 6.67430e+2 / 5;
        for (const mover of otherMovers) {
            if (this === mover)
                continue;
            acc = acc.add(mover.position_
                .sub(this.position_)
                .setMagnitude((G * mover.mass * this.mass) /
                (this.position_.dist(mover.position_) ** 2)));
        }
        acc = acc.add(this.velocity_.negate().setMagnitude(this.mass / 25));
        return acc.div(this.mass);
    }
    checkWalls(width, height, bounce = true) {
        if (!bounce) {
            this.position_ = this.position_.setX((x) => Utils.mod(x, width))
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
    checkMovers(otherMovers) {
        if (this.hasCollided)
            return;
        for (const mover of otherMovers) {
            if (this === mover)
                continue;
            if (this.position_.dist(mover.position_) <= this.radius_ + mover.radius_) {
                this.hasCollided = mover.hasCollided = true;
                //https://www.geeksforgeeks.org/elastic-collision-formula/
                const v1i = mover.position_
                    .sub(this.position_)
                    .setMagnitude(this.velocity_.mag());
                const v2i = this.position_
                    .sub(mover.position_)
                    .setMagnitude(mover.velocity_.mag());
                this.velocity_ = v1i
                    .mult(this.mass - mover.mass)
                    .add(v2i.mult(2 * mover.mass))
                    .div(this.mass + mover.mass);
                mover.velocity_ = v2i
                    .mult(mover.mass - this.mass)
                    .add(v1i.mult(2 * this.mass))
                    .div(this.mass + mover.mass);
                const avgPos = this.position_.add(mover.position_).div(2);
                // Make the fastest one move so they don't overlap
                if (this.velocity_.magSq() > mover.velocity_.magSq())
                    this.position_ = this.position_
                        .sub(mover.position_)
                        .setMagnitude(this.radius_ + mover.radius_)
                        .add(mover.position_);
                else
                    mover.position_ = mover.position_
                        .sub(this.position_)
                        .setMagnitude(this.radius_ + mover.radius_)
                        .add(this.position_);
                return;
            }
        }
    }
    limitVelocity(maxMagnitude) {
        this.velocity_ = this.velocity_.limit(maxMagnitude);
    }
    //public limit
    render(canvas, color = "black") {
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            console.log("Could get a \"2d\" context from ", canvas);
            return false;
        }
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.position_.x, this.position_.y, this.radius_, 0, 2 * Math.PI);
        ctx.fill();
        this.hasCollided = false;
        return true;
    }
}
