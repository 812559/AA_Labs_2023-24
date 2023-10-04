import Body from "./body.js";
export default class Particle extends Body {
    initialTime;
    lifeSpan;
    originalColor;
    colorEffect;
    constructor(params) {
        super(params);
        this.initialTime = Date.now();
        this.lifeSpan = params.lifeSpan;
        this.colorEffect = params.colorEffect;
        this.originalColor = this.color;
    }
    update(deltaTime, environment, newAcceleration) {
        super.update(deltaTime, environment, this.acceleration);
        if (this.colorEffect)
            this.color = this.colorEffect((Date.now() - this.initialTime) / this.lifeSpan, this.originalColor);
    }
    applyBehaviors(environment, envWidth, envHeight) {
        if (this.initialTime + this.lifeSpan <= Date.now()) {
            environment.splice(environment.indexOf(this), 1);
        }
    }
    render(canvas) {
        const ctx = canvas.getContext("2d");
        ctx.globalAlpha;
        super.render(canvas);
    }
}
