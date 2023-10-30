export default class Vec2D {
    x;
    y;
    constructor(x = 0, y = 0) {
        if (Number.isNaN(x))
            throw new Error("x is NaN");
        if (Number.isNaN(y))
            throw new Error("y is NaN");
        this.x = x;
        this.y = y;
    }
    static I = new Vec2D(1, 0);
    static J = new Vec2D(0, 1);
    static from(vector) {
        return new Vec2D(vector.x, vector.y);
    }
    static fromAngle(theta, magnitude = 1) {
        return new Vec2D(magnitude * Math.cos(theta), magnitude * Math.sin(theta));
    }
    static random(xRange, yRange) {
        return new Vec2D(Math.random() * xRange, Math.random() * yRange);
    }
    equals(other) {
        return this.x === other.x && this.y === other.y;
    }
    copy() {
        return new Vec2D(this.x, this.y);
    }
    setX(xMutator) {
        return new Vec2D(xMutator(this.x), this.y);
    }
    setY(yMutator) {
        return new Vec2D(this.x, yMutator(this.y));
    }
    add(vector) {
        return new Vec2D(this.x + vector.x, this.y + vector.y);
    }
    sub(vector) {
        return new Vec2D(this.x - vector.x, this.y - vector.y);
    }
    negate() {
        return new Vec2D(-this.x, -this.y);
    }
    mult(scalar) {
        return new Vec2D(this.x * scalar, this.y * scalar);
    }
    mag() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    magSq() {
        return this.x ** 2 + this.y ** 2;
    }
    setMagnitude(newMag) {
        return this.mult(newMag / this.mag());
    }
    normalize() {
        return this.setMagnitude(1);
    }
    limit(maxMag) {
        return this.mag() > maxMag ? this.setMagnitude(maxMag) : this;
    }
    div(scalar) {
        return new Vec2D(this.x / scalar, this.y / scalar);
    }
    angle() {
        return Math.atan2(this.y, this.x);
    }
    setAngle(theta) {
        const mag = this.mag();
        return new Vec2D(Math.cos(theta) * mag, Math.sin(theta) * mag);
    }
    rotate(theta) {
        const angle = this.angle();
        const mag = this.mag();
        return new Vec2D(Math.cos(angle + theta) * mag, Math.sin(angle + theta) * mag);
    }
    angleBetween(vector) {
        return this.angle() - vector.angle();
    }
    dist(vector) {
        return Math.sqrt((this.x - vector.x) ** 2 + (this.y - vector.y) ** 2);
    }
    distSQ(vector) {
        return (this.x - vector.x) ** 2 + (this.y - vector.y) ** 2;
    }
}
;
