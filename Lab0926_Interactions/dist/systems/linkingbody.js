import BodyWithSatellites from "./bodywithsatellites.js";
import Link from "./link.js";
export default class LinkingBody extends BodyWithSatellites {
    applyBehaviors(environment, envWidth, envHeight) {
        super.applyBehaviors(environment, envWidth, envHeight);
        // Only apply linking behavior if this in the enviroment---not already in a link
        if (environment.indexOf(this) === -1)
            return;
        for (let i = environment.length - 1; i >= 0; --i) {
            const system = environment[i];
            if (!(system instanceof BodyWithSatellites))
                continue;
            if (system === this)
                continue;
            const actualDist = this.position.dist(system.position);
            const dist = this.orbitalRadius + system.orbitalRadius;
            console.log("actual: ", actualDist, "dist: ", dist);
            if (actualDist < dist) {
                const indexOfThis = environment.indexOf(this);
                environment.splice(i, 1);
                environment.splice(indexOfThis, 1);
                const link = new Link(this, system, dist);
                environment.push(link);
                break;
            }
        }
    }
}
