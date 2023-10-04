import Body from "./body.js";
import { TAU } from "../utils.js";
import Vec2D from "../vec2d.js";
export default class BodyWithSatellites extends Body {
    angle;
    angularVelocity;
    amountOfSatellites;
    orbitalRadius;
    satelliteRadius;
    satelliteColor;
    constructor(bodyParams, satelliteParams) {
        super(bodyParams);
        this.angle = satelliteParams.initialAngle ?? 0;
        this.angularVelocity = satelliteParams.angularVelocity ?? 0;
        this.satelliteRadius = satelliteParams.radius;
        this.orbitalRadius = satelliteParams.orbitalRadius ?? this.radius * 2;
        this.amountOfSatellites = satelliteParams.amount ?? 1;
        this.satelliteColor = satelliteParams.color ?? this.color;
    }
    update(deltaTime, environment, newAcceleration) {
        super.update(deltaTime, environment);
        this.angle += this.angularVelocity * deltaTime;
    }
    render(canvas) {
        super.render(canvas);
        const ctx = canvas.getContext("2d");
        if (!ctx)
            return;
        const deltaTheta = TAU / this.amountOfSatellites;
        ctx.fillStyle = this.satelliteColor;
        for (let i = 0; i < this.amountOfSatellites; ++i) {
            const pos = this.position.add(Vec2D.fromAngle(i * deltaTheta + this.angle, this.orbitalRadius));
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, this.satelliteRadius, 0, TAU);
            ctx.fill();
        }
    }
}
