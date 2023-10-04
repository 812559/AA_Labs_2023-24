import Firework from "./systems/firework.js";
import { Color, resizeCanvas } from "./utils.js";
import Vec2D from "./vec2d.js";
window.addEventListener("load", init);
function init() {
    const game = {
        canvas: window.document.querySelector("canvas"),
        time: 0,
        env: new Array(),
    };
    resizeCanvas(game.canvas);
    const n = 1;
    for (let i = 0; i < n; ++i) {
        game.env.push(new Firework({
            position: new Vec2D(game.canvas.width / 2, game.canvas.height),
            detonationHeight: game.canvas.height / 2,
            color: new Color(255, 23, 45, 1),
        }));
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
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);
    const n = 10;
    for (let i = 0; i < n; ++i) {
        for (const mover of game.env) {
            mover.update(dt / n, game.env);
        }
    }
    for (const mover of game.env) {
        mover.applyBehaviors(game.env, game.canvas.width, game.canvas.height);
        mover.render(game.canvas);
    }
    if (Math.random() > 0.9) {
        game.env.push(new Firework({
            position: new Vec2D(game.canvas.width * Math.random(), game.canvas.height),
            detonationHeight: (game.canvas.height / 2) * (1 - Math.random()),
            color: Color.hsv(Math.random() * 360, 1, 1),
        }));
    }
    requestAnimationFrame(() => animate(game));
}
