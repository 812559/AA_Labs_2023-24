import { Color, TAU, resizeCanvas, $ } from "./utils.js";
import Vec2D from "./vec2d.js";
import Body from "./systems/body.js";
import Snake from "./systems/snake.js";
window.addEventListener("load", init);
function init() {
    const worldScale = 8;
    const game = {
        time: 0,
        env: new Array(),
        cnv: { main: $("#main"), mini: $("#mini") },
        world: {
            x: 0,
            y: 0,
            w: window.innerWidth * worldScale,
            h: window.innerHeight * worldScale,
        },
        renderArea: {
            x: 0,
            y: 0,
            w: 0,
            h: 0, // Changed later
        },
    };
    resizeCanvas(game.cnv.main);
    resizeCanvas(game.cnv.mini);
    game.renderArea.w = $("#main").width;
    game.renderArea.h = $("#main").height;
    window.addEventListener("keydown", (event) => {
        const dx = (game.world.w - game.renderArea.w) / 10;
        const dy = (game.world.h - game.renderArea.h) / 10;
        switch (event.key) {
            case "ArrowDown":
                game.renderArea.y = Math.min(game.world.h - game.renderArea.h, game.renderArea.y + dy);
                break;
            case "ArrowUp":
                game.renderArea.y = Math.max(0, game.renderArea.y - dy);
                break;
            case "ArrowLeft":
                game.renderArea.x = Math.max(0, game.renderArea.x - dx);
                break;
            case "ArrowRight":
                game.renderArea.x = Math.min(game.world.w - game.renderArea.w, game.renderArea.x + dx);
                break;
            default:
                break;
        }
        console.log(game.renderArea.y, game.renderArea.h, game.world.h);
    });
    const center = new Vec2D(game.world.w / 2, game.world.h / 2);
    const randPos = () => Vec2D.random(game.world.w, game.world.h);
    for (let i = 0; i < 1000; ++i)
        game.env.push(new Body({
            radius: 30,
            position: randPos(),
            velocity: Vec2D.fromAngle(Math.random() * TAU, Math.random() * 25),
            color: Color.random(),
        }));
    game.env.push(new Snake({
        headPosition: center,
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
    game.time = Date.now();
    console.log(game);
    animate(game);
}
function animate(game) {
    const currentTime = Date.now();
    const dt = (currentTime - game.time) * 1e-3; // Delta time bewteen last 'frame' in seconds
    game.time = currentTime;
    renderAxisBox(game);
    const subSteps = 1;
    for (let i = 0; i < subSteps; ++i) {
        for (let j = 0; j < game.env.length; ++j) {
            game.env[j].update(dt / subSteps, game.env, game.world);
            // This might be very bad for performance (depending on subSteps)
            // But better for realism
            game.env[j].applyBehaviors(game.env, dt / subSteps, game.world);
        }
    }
    for (let i = 0; i < game.env.length; ++i) {
        game.env[i].render(game.cnv, game.world, game.renderArea);
    }
    requestAnimationFrame(() => animate(game));
}
function renderAxisBox(game) {
    const miniCtx = game.cnv.mini.getContext("2d");
    const mainCtx = game.cnv.main.getContext("2d");
    mainCtx.clearRect(0, 0, game.cnv.main.width, game.cnv.main.height);
    miniCtx.clearRect(0, 0, game.cnv.mini.width, game.cnv.mini.height);
    miniCtx.save();
    // Outline
    miniCtx.strokeStyle = "black";
    miniCtx.fillStyle = "white";
    miniCtx.lineWidth = 2;
    miniCtx.beginPath();
    miniCtx.rect(0, 0, game.cnv.mini.width, game.cnv.mini.height);
    miniCtx.fill();
    miniCtx.stroke();
    // Display grid
    miniCtx.lineWidth = 1;
    miniCtx.beginPath();
    miniCtx.moveTo(0, game.cnv.mini.height / 2);
    miniCtx.lineTo(game.cnv.mini.width, game.cnv.mini.height / 2);
    miniCtx.stroke();
    miniCtx.beginPath();
    miniCtx.moveTo(game.cnv.mini.width / 2, 0);
    miniCtx.lineTo(game.cnv.mini.width / 2, game.cnv.mini.height);
    miniCtx.stroke();
    // Display reder area
    miniCtx.strokeStyle = "blue";
    miniCtx.lineWidth = 5;
    miniCtx.scale(game.cnv.mini.width / game.world.w, game.cnv.mini.height / game.world.h);
    miniCtx.translate(game.renderArea.x, game.renderArea.y);
    miniCtx.beginPath();
    miniCtx.rect(0, 0, game.renderArea.w, game.renderArea.h);
    miniCtx.stroke();
    miniCtx.restore();
    mainCtx.save();
    mainCtx.strokeStyle = "black";
    mainCtx.lineWidth = 5;
    const w2 = game.world.w / 2;
    const h2 = game.world.h / 2;
    mainCtx.translate(w2 - game.renderArea.x, h2 - game.renderArea.y);
    mainCtx.beginPath();
    mainCtx.moveTo(-w2, 0);
    mainCtx.lineTo(w2, 0);
    mainCtx.stroke();
    mainCtx.beginPath();
    mainCtx.moveTo(0, -h2);
    mainCtx.lineTo(0, h2);
    mainCtx.stroke();
    mainCtx.restore();
}
