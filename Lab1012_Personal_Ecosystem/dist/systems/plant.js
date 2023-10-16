import Particle from "./particle.js";
export default class Plant extends Particle {
    hpGiven;
    constructor(params) {
        super(params);
        this.hpGiven = params.hpGiven;
    }
}
