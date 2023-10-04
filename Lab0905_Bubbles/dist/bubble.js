import Vec2D from "./vec2d.js";
export default class Bubble {
    radius_;
    pos_;
    vel_;
    acc_;
    overlapping_ = false;
    defaultColor_;
    overlapColor_;
    constructor(radius, pos = new Vec2D, vel = new Vec2D, acc = new Vec2D, defaultColor = "white", overlapColor = "pink") {
        this.radius_ = radius;
        this.pos_ = pos;
        this.vel_ = vel;
        this.acc_ = acc;
        this.defaultColor_ = defaultColor;
        this.overlapColor_ = overlapColor;
    }
    static Builder = class Builder {
        radius;
        pos;
        vel;
        acc;
        defaultClr;
        overlapClr;
        constructor(radius) {
            this.radius = radius;
            this.pos = new Vec2D();
            this.vel = new Vec2D();
            this.acc = new Vec2D();
            this.defaultClr = "black";
            this.overlapClr = "white";
        }
        build() {
            return new Bubble(this.radius, this.pos, this.vel, this.acc, this.defaultClr, this.overlapClr);
        }
        position(pos) {
            this.pos = pos;
            return this;
        }
        velocity(vel) {
            this.vel = vel;
            return this;
        }
        acceleration(acc) {
            this.acc = acc;
            return this;
        }
        defaultColor(clr) {
            this.defaultClr = clr;
            return this;
        }
        overlapColor(clr) {
            this.overlapClr = clr;
            return this;
        }
    };
    get radius() {
        return this.radius_;
    }
    get pos() {
        return this.pos_;
    }
    get vel() {
        return this.vel_;
    }
    get acc() {
        return this.acc_;
    }
    get overlapping() {
        return this.overlapping_;
    }
    get defaultColor() {
        return this.defaultColor_;
    }
    get overlapColor() {
        return this.overlapColor_;
    }
    applyForces(attractors, repulsers) {
        const fricction = 0.5;
        let acc = this.vel.negate()
            .normalize()
            .mult(fricction);
        const scale = 1e+4;
        for (const attractor of attractors) {
            let tmp = attractor.pos
                .sub(this.pos)
                .normalize()
                .mult(Math.PI * attractor.radius ** 2)
                .div(this.pos.dist(attractor.pos) ** 2)
                .mult(scale);
            acc = acc.add(tmp);
            //acc = tmp
        }
        for (const repulser of repulsers) {
            let tmp = this.pos
                .sub(repulser.pos)
                .normalize()
                .mult(Math.PI * repulser.radius ** 2)
                .div(this.pos.dist(repulser.pos) ** 2)
                .mult(scale);
            acc = acc.add(tmp);
            //acc = tmp
        }
        return acc.div(Math.PI * this.radius ** 2);
    }
    update(deltaTime, newAccelaration = new Vec2D) {
        // Verlet integration: https://en.wikipedia.org/wiki/Verlet_integration
        this.pos_ = this.pos_
            .add(this.vel_.mult(deltaTime))
            .add(this.acc_.mult(deltaTime ** 2 * 0.5));
        this.vel_ = this.vel_
            .add(this.acc_.add(newAccelaration).mult(deltaTime * 0.5));
        this.acc_ = newAccelaration;
    }
    limitVelocity(limit) {
        this.vel_ = this.vel_.limit(limit);
    }
    checkWalls(width, height) {
        if (this.pos_.x - this.radius_ < 0) {
            this.pos_ = this.pos_.setX((x) => this.radius_);
            this.vel_ = this.vel_.setX((x) => -x);
        }
        else if (this.pos_.x + this.radius_ > width) {
            this.pos_ = this.pos_.setX((x) => width - this.radius_);
            this.vel_ = this.vel_.setX((x) => -x);
            console.log(Date.now());
        }
        if (this.pos_.y - this.radius_ < 0) {
            this.pos_ = this.pos_.setY((y) => this.radius_);
            this.vel_ = this.vel_.setY((y) => -y);
        }
        else if (this.pos_.y + this.radius_ > height) {
            this.pos_ = this.pos_.setY((y) => height - this.radius_);
            this.vel_ = this.vel_.setY((y) => -y);
        }
    }
    checkOverlap(otherBubbles) {
        if (this.overlapping_)
            return;
        for (const b of otherBubbles) {
            if (b === this)
                continue;
            if (this.pos_.dist(b.pos_) <= this.radius_ + b.radius_) {
                this.overlapping_ = b.overlapping_ = true;
            }
        }
    }
    render(canvas) {
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            console.log("Could not retrieve a \'2d\' context from ", canvas);
            return;
        }
        ctx.fillStyle = this.overlapping_ ? this.overlapColor_ : this.defaultColor_;
        ctx.beginPath();
        ctx.arc(this.pos_.x, this.pos_.y, this.radius_, 0, Math.PI * 2, true);
        ctx.fill();
    }
    resetOverlapping() {
        this.overlapping_ = false;
    }
}
