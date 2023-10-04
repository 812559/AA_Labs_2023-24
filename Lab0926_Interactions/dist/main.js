import LinkingBody from "./systems/linkingbody.js";
import { TAU, resizeCanvas } from "./utils.js";
import Vec2D from "./vec2d.js";
window.addEventListener("load", init);
function init() {
    const game = {
        canvas: window.document.querySelector("canvas"),
        time: 0,
        env: new Array(),
    };
    resizeCanvas(game.canvas);
    const n = 10;
    for (let i = 0; i < n; ++i) {
        game.env.push(new LinkingBody({
            radius: 40,
            position: new Vec2D(Math.random() * game.canvas.width, Math.random() * game.canvas.height),
            velocity: Vec2D.fromAngle(Math.random() * Math.PI * 2, Math.random() * 50),
        }, {
            radius: 10,
            amount: 4,
            color: "red",
            angularVelocity: TAU / 20
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
    ctx.fillStyle = "rgba(255, 255, 255, 0.025)";
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
    requestAnimationFrame(() => animate(game));
}
