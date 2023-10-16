import { Color, TAU, resizeCanvas } from "./utils.js";
import Vec2D from "./vec2d.js";
import ParticleGenerator from "./systems/generator.js";
import Plant from "./systems/plant.js";
import Herbivore from "./systems/herbivore.js";
window.addEventListener("load", init);
function init() {
    const game = {
        canvas: window.document.querySelector("canvas"),
        time: 0,
        env: new Array(),
    };
    resizeCanvas(game.canvas);
    game.env.push(new ParticleGenerator({
        newParticle: (pos) => new Plant({
            radius: 10,
            lifeSpan: 5,
            hpGiven: 1,
            position: pos,
            velocity: Vec2D.fromAngle(Math.random() * TAU, 100),
            color: Color.GREEN,
        }),
        position: new Vec2D(game.canvas.width / 2, game.canvas.height / 2),
        radius: 20,
        particlesPerSecond: 1,
    }));
    for (let i = 0; i < 10; ++i) {
        game.env.push(new Herbivore({
            position: new Vec2D(game.canvas.width * Math.random(), game.canvas.height * Math.random()),
            velocity: Vec2D.fromAngle(Math.random() * TAU, 25),
            radius: 25,
            hp: 10
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
        for (let j = 0; j < game.env.length; ++j) {
            game.env[j].update(dt / n, game.env);
        }
    }
    for (let i = 0; i < game.env.length; ++i) {
        game.env[i].render(game.canvas);
        game.env[i].applyBehaviors(game.env, dt, game.canvas.width, game.canvas.height);
    }
    requestAnimationFrame(() => animate(game));
}
