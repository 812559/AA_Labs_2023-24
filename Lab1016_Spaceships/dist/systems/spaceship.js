import Vec2D from "../vec2d.js";
import Body from "./body.js";
import Planet from "./planet.js";
export default class SpaceShip extends Body {
    static shipPoints = [
        { x: 1, y: 0 },
        { x: -1, y: 2 / 3 },
        { x: -1 / 3, y: 0 },
        { x: -1, y: -2 / 3 },
        { x: 1, y: 0 },
    ];
    static flamePoints = [
        { x: -2 / 3, y: 0 },
        { x: -1, y: 1 / 3 },
        { x: -5 / 3, y: 0 },
        { x: -1, y: -1 / 3 },
        { x: -2 / 3, y: 0 },
    ];
    static maxVel = 50;
    constructor(params) {
        super(params);
    }
    update(deltaTime, environment, envWidth, envHeight, newAcceleration) {
        let newAcc = new Vec2D();
        const accMag = 10;
        for (let i = 0; i < environment.length; ++i) {
            if (!(environment[i] instanceof Planet))
                continue;
            newAcc = newAcc.add(environment[i].position.sub(this.position).setMagnitude(accMag));
        }
        this.velocity = this.velocity.limit(SpaceShip.maxVel);
        super.update(deltaTime, environment, envWidth, envHeight, newAcc);
    }
    render(canvas) {
        const ctx = canvas.getContext("2d");
        if (!ctx)
            return;
        ctx.save();
        ctx.fillStyle = this.color.toString();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.velocity.angle());
        // Ship
        ctx.beginPath();
        ctx.moveTo(this.radius * SpaceShip.shipPoints[0].x, this.radius * SpaceShip.shipPoints[0].y);
        for (const point of SpaceShip.shipPoints)
            ctx.lineTo(this.radius * point.x, this.radius * point.y);
        ctx.fill();
        // Flame
        ctx.fillStyle = "#cf352e";
        ctx.beginPath();
        ctx.moveTo(this.radius * SpaceShip.flamePoints[0].x, this.radius * SpaceShip.flamePoints[0].y);
        for (const point of SpaceShip.flamePoints) {
            const scale = point.x + point.y == -5 / 3
                ? 1 + Math.random()
                : 1;
            ctx.lineTo(this.radius * point.x * scale, this.radius * point.y);
        }
        ctx.fill();
        ctx.translate(-this.position.x, -this.position.y);
        ctx.restore();
    }
}
