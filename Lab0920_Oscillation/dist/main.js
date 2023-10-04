import { Utils } from "./utils.js";
import Mover from "./mover.js";
import System from "./system.js";
import Vec2D from "./vec2d.js";
window.addEventListener("load", init);
function init() {
    const game = {
        canvas: window.document.querySelector("canvas"),
        time: 0,
        system: new System(new Mover({ radius: 0 }), {}),
    };
    Utils.resizeCanvas(game.canvas);
    const parent = new Mover({
        radius: 50,
        mass: 4e16,
        position: new Vec2D(game.canvas.width / 2, game.canvas.height / 2),
        //velocity: Vec2D.fromAngle(Math.random() * Math.PI * 2, Math.random() * 100),
    });
    game.system = new System(parent);
    for (let i = 0; i < 10; ++i) {
        game.system.addSatellite({
            amount: 1,
            radius: Math.random() * 15 + 5,
            mass: 3e10,
            initialAngle: Math.random() * 2 * Math.PI,
            orbitalRadius: Math.random() * 300 + 100,
            eccentricity: Math.random() * 0.9,
            direction: Math.random() > 0.5 ? "clockwise" : "counterclockwise",
        });
    }
    game.time = Date.now();
    console.log(game);
    animate(game);
}
function animate(game) {
    const currentTime = Date.now();
    const dt = (currentTime - game.time) * 1e-3; // Delta time bewteen last 'frame' in seconds
    game.time = currentTime;
    const ctx = game.canvas.getContext("2d");
    ctx.fillStyle = "rgba(255, 255, 255, 0.025)";
    ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);
    const n = 10;
    for (let i = 0; i < n; ++i)
        game.system.update(dt / n);
    game.system.render(game.canvas, {
        //satellites: (a, i) => `hsl(${a * 180 / Math.PI}, 100%,  50%)`
        satellites: (a, i) => `hsl(${(i * 360) / game.system.numSatellites}, 100%,  50%)`,
    });
    requestAnimationFrame(() => animate(game));
}
