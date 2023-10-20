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
        switch (this.renderStyle) {
            case "circle":
                super.render(canvas);
                break;
            case "square":
                ctx.save();
                ctx.translate(this.position.x, this.position.y);
                ctx.rotate(this.velocity.angle());
                ctx.scale(this.radius, this.radius);
                ctx.fillStyle = this.color.toString();
                ctx.beginPath();
                ctx.moveTo(Particle.squarePoints[0].x, Particle.squarePoints[0].y);
                for (const point of Particle.squarePoints)
                    ctx.lineTo(point.x, point.y);
                ctx.closePath();
                ctx.fill();
                ctx.translate(-this.position.x, -this.position.y);
                ctx.restore();
                break;
            case "triangle":
                ctx.save();
                ctx.translate(this.position.x, this.position.y);
                ctx.rotate(this.velocity.angle());
                ctx.scale(this.radius, this.radius);
                ctx.fillStyle = this.color.toString();
                ctx.beginPath();
                ctx.moveTo(Particle.trianglePoints[0].x, Particle.trianglePoints[0].y);
                for (const point of Particle.trianglePoints)
                    ctx.lineTo(point.x, point.y);
                ctx.closePath();
                ctx.fill();
                ctx.translate(-this.position.x, -this.position.y);
                ctx.restore();
                break;
        }
    }
}
