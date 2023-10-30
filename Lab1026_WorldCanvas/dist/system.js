import { TAU } from "./utils.js";
export default class System {
    constructor() { }
    static renderCircle(position, color, radius, cnv, world, renderArea) {
        const miniCtx = cnv.mini.getContext("2d");
        const mainCtx = cnv.main.getContext("2d");
        miniCtx.save();
        miniCtx.fillStyle = color.toString();
        miniCtx.scale(cnv.mini.width / world.w, cnv.mini.height / world.h);
        miniCtx.translate(position.x, position.y);
        miniCtx.beginPath();
        miniCtx.arc(0, 0, radius, 0, TAU);
        miniCtx.fill();
        miniCtx.restore();
        mainCtx.save();
        mainCtx.fillStyle = color.toString();
        mainCtx.translate(position.x - renderArea.x, position.y - renderArea.y);
        mainCtx.beginPath();
        mainCtx.arc(0, 0, radius, 0, TAU);
        mainCtx.fill();
        mainCtx.restore();
    }
    /**
     * Remove this system from an environment
     * @param environment the environment this system belongs to
     */
    removeFrom(environment) {
        if (environment.includes(this))
            environment.splice(environment.indexOf(this), 1);
    }
}
