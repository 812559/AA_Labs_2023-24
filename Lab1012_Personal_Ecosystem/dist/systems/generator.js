import Body from "./body.js";
export default class ParticleGenerator extends Body {
    particlesPerSecond;
    newParticle;
    lastTime;
    constructor(params) {
        super(params);
        this.particlesPerSecond = params.particlesPerSecond ?? 1;
        this.newParticle = params.newParticle;
        this.lastTime = Date.now() / 1000;
    }
    applyBehaviors(environment, deltaTime, envWidth, envHeight) {
        super.applyBehaviors(environment, deltaTime, envWidth, envHeight);
        if (this.lastTime + this.particlesPerSecond <= Date.now() / 1000) {
            environment.push(this.newParticle(this.position));
            this.lastTime = Date.now() / 1000;
        }
    }
}
