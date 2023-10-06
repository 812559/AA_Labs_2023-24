import { Color, resizeCanvas } from "./utils.js";
import Vec2D from "./vec2d.js";
import Snake from "./systems/snake.js";
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
        game.env.push(new Snake({
            headPosition: new Vec2D(game.canvas.width / 2, game.canvas.height / 2),
            radius: 50,
            amountOfSegments: 50,
            colorPattern: [
                Color.hex("0x586BA4"),
                Color.hex("0x324376"),
                Color.hex("0xF5DD90"),
                Color.hex("0xF68E5F"),
                Color.hex("0xF76C5E"),
            ],
            speed: 5,
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
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);
    const n = 10;
    for (let i = 0; i < n; ++i) {
        for (const mover of game.env) {
            mover.update(dt / n, game.env);
            mover.applyBehaviors(game.env, game.canvas.width, game.canvas.height);
        }
    }
    for (const mover of game.env) {
        mover.render(game.canvas);
    }
    requestAnimationFrame(() => animate(game));
}
