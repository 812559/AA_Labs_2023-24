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
            amountOfSegments: 100,
            colorPattern: [
                Color.hex("03071e"),
                Color.hex("370617"),
                Color.hex("6a040f"),
                Color.hex("9d0208"),
                Color.hex("d00000"),
                Color.hex("dc2f02"),
                Color.hex("e85d04"),
                Color.hex("f48c06"),
                Color.hex("faa307"),
                Color.hex("ffba08"),
                //Color.hex("ffba08"),
                Color.hex("faa307"),
                Color.hex("f48c06"),
                Color.hex("e85d04"),
                Color.hex("dc2f02"),
                Color.hex("d00000"),
                Color.hex("9d0208"),
                Color.hex("6a040f"),
                Color.hex("370617"),
                //Color.hex("03071e"),
            ],
            speed: 15,
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
        for (const system of game.env) {
            system.update(dt / n, game.env);
        }
    }
    for (const system of game.env) {
        system.render(game.canvas);
        system.applyBehaviors(game.env, game.canvas.width, game.canvas.height);
    }
    requestAnimationFrame(() => animate(game));
}
