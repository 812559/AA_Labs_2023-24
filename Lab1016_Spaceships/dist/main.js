import Planet from "./systems/planet.js";
import SpaceShip from "./systems/spaceship.js";
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
    const center = new Vec2D(game.canvas.width / 2, game.canvas.height / 2);
    const randPos = () => new Vec2D(game.canvas.width * Math.random(), game.canvas.height * Math.random());
    game.env.push(new Planet({
        position: center,
        radius: 70,
        onWallCollision: "modulus",
        color: Color.hex("e0bd88"),
    }));
    game.env.push(new SpaceShip({
        position: randPos(),
        radius: 35,
        velocity: Vec2D.fromAngle(0, 25),
        onWallCollision: "modulus",
        color: Color.hex("#1f4277"),
    }));
    game.time = Date.now();
    console.log(game);
    animate(game);
}
function animate(game) {
    const currentTime = Date.now();
    const dt = (currentTime - game.time) * 1e-3; // Delta time bewteen last 'frame' in seconds
    game.time = currentTime;
    const ctx = game.canvas.getContext("2d");
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);
    const n = 10;
    for (let i = 0; i < n; ++i) {
        for (let j = 0; j < game.env.length; ++j) {
            game.env[j].update(dt / n, game.env, game.canvas.width, game.canvas.height);
        }
    }
    for (let i = 0; i < game.env.length; ++i) {
        game.env[i].render(game.canvas);
        game.env[i].applyBehaviors(game.env, dt, game.canvas.width, game.canvas.height);
    }
    requestAnimationFrame(() => animate(game));
}
