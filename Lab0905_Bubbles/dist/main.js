import Vec2D from "./vec2d.js";
import Bubble from "./bubble.js";
window.addEventListener('load', init);
function resiveCanvas(canvas) {
    const pxRatio = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * pxRatio;
    canvas.height = canvas.clientHeight * pxRatio;
}
function init() {
    const game = {
        canvas: window.document.querySelector('canvas'),
        bubbles: Array(200),
        attractor: new Bubble(0),
        repulser: new Bubble(0),
        time: 0,
    };
    resiveCanvas(game.canvas);
    const width = game.canvas.width, height = game.canvas.height, diagonal = Math.sqrt(width ** 2 + height ** 2), scale = diagonal / 2202.90717008;
    for (let i = 0; i < 200; ++i) {
        const pos = new Vec2D(Math.random() * width, Math.random() * height), vel = Vec2D.fromAngle(Math.random() * Math.PI * 2, 5), radius = (Math.random() * 0.5 + 0.5) * 30 * scale;
        game.bubbles[i] = new Bubble(radius, pos, vel, new Vec2D(), "pink", "pink");
    }
    ;
    game.attractor = new Bubble.Builder(100)
        .position(new Vec2D(width / 4, height / 2))
        .velocity(Vec2D.fromAngle(Math.random() * Math.PI * 2))
        .defaultColor("green")
        .overlapColor("green")
        .build();
    game.repulser = new Bubble.Builder(100)
        .position(new Vec2D(3 * width / 4, height / 2))
        .velocity(Vec2D.fromAngle(Math.random() * Math.PI * 2))
        .defaultColor("red")
        .overlapColor("red")
        .build();
    console.log("Start: ", game.time = Date.now());
    animate(game);
}
function animate(game) {
    const currentTime = Date.now();
    const dt = (currentTime - game.time) / 1000; // Delta time bewteen last 'frame' in seconds
    game.time = currentTime;
    const ctx = game.canvas.getContext("2d");
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);
    for (const bubble of game.bubbles) {
        bubble.update(dt, bubble.applyForces([game.attractor], [game.repulser]));
        bubble.limitVelocity(5);
        bubble.checkWalls(game.canvas.width, game.canvas.height);
        bubble.checkOverlap(game.bubbles);
        bubble.render(game.canvas);
        bubble.resetOverlapping();
    }
    console.log(game.bubbles[0]);
    game.attractor.update(dt);
    game.attractor.checkWalls(game.canvas.width, game.canvas.height);
    game.attractor.render(game.canvas);
    game.repulser.update(dt);
    game.repulser.checkWalls(game.canvas.width, game.canvas.height);
    game.repulser.render(game.canvas);
    requestAnimationFrame(() => animate(game));
}
