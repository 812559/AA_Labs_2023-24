import Body from "./body.js";
export default class Particle extends Body {
    static trianglePoints = [
        { x: 1, y: 0 },
        { x: -0.5, y: Math.sqrt(3) / 2 },
        { x: -0.5, y: -Math.sqrt(3) / 2 },
    ];
    static squarePoints = [
        { x: Math.SQRT1_2, y: Math.SQRT1_2 },
        { x: -Math.SQRT1_2, y: Math.SQRT1_2 },
        { x: -Math.SQRT1_2, y: -Math.SQRT1_2 },
        { x: Math.SQRT1_2, y: -Math.SQRT1_2 },
    ];
    initialTime;
    lifeSpan;
    originalColor;
    colorEffect;
    renderStyle;
    constructor(params) {
        super(params);
        this.initialTime = Date.now() / 1000;
        this.lifeSpan = params.lifeSpan;
        this.colorEffect = params.colorEffect;
        this.originalColor = this.color;
        if (!params.renderStyle || params.renderStyle == "random") {
            const rand = Math.random();
            if (rand < 1 / 3)
                this.renderStyle = "circle";
            else if (rand < 2 / 3)
                this.renderStyle = "square";
            else
                this.renderStyle = "triangle";
        }
        else {
            this.renderStyle = params.renderStyle;
        }
    }
    update(deltaTime, environment, newAcceleration) {
        super.update(deltaTime, environment, this.acceleration);
        if (this.colorEffect)
            this.color = this.colorEffect((Date.now() - this.initialTime) / this.lifeSpan, this.originalColor);
    }
    applyBehaviors(environment, deltaTime, envWidth, envHeight) {
        if (this.initialTime + this.lifeSpan <= Date.now() / 1000) {
            this.removeFrom(environment);
        }
    }
    render(canvas) {
        const ctx = canvas.getContext("2d");
        if (!ctx)
            return;
        let points;
        switch (this.renderStyle) {
            case "circle":
                super.render(canvas);
                return;
            case "square":
                points = Particle.squarePoints;
                break;
            case "triangle":
                points = Particle.trianglePoints;
                break;
        }
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.velocity.angle());
        ctx.scale(this.radius, this.radius);
        ctx.fillStyle = this.color.toString();
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (const point of points)
            ctx.lineTo(point.x, point.y);
        ctx.closePath();
        ctx.fill();
        ctx.translate(-this.position.x, -this.position.y);
        ctx.restore();
    }
}
