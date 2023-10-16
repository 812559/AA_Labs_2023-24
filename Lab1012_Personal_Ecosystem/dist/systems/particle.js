import Body from "./body.js";
export default class Particle extends Body {
    initialTime;
    lifeSpan;
    originalColor;
    colorEffect;
    constructor(params) {
        super(params);
        this.initialTime = Date.now() / 1000;
        this.lifeSpan = params.lifeSpan;
        this.colorEffect = params.colorEffect;
        this.originalColor = this.color;
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
    removeFrom(environment) {
        environment.splice(environment.indexOf(this), 1);
    }
    render(canvas) {
        const ctx = canvas.getContext("2d");
        super.render(canvas);
    }
}
