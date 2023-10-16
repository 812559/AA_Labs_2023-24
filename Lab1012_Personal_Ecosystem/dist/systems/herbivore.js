import { Color } from "../utils.js";
import Body from "./body.js";
import Plant from "./plant.js";
export default class Herbivore extends Body {
    hp;
    constructor(params) {
        super(params);
        this.hp = params.hp;
        this.color = Color.hex('0x604C3D');
    }
    update(deltaTime, environment, newAcceleration) {
        super.update(deltaTime, environment, newAcceleration);
        this.hp -= deltaTime;
    }
    applyBehaviors(environment, deltaTime, envWidth, envHeight) {
        super.applyBehaviors(environment, deltaTime, envWidth, envHeight);
        for (let i = 0; i < environment.length; ++i) {
            if (this.position.dist(environment[i].position) <= this.radius &&
                environment[i] instanceof Plant) {
                this.hp += environment[i].hpGiven;
                environment[i].removeFrom(environment);
            }
        }
        if (this.hp <= 0)
            environment.splice(environment.indexOf(this), 1);
    }
}
