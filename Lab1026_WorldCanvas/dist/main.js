import { resizeCanvas } from "./utils.js";
import Vec2D from "./vec2d.js";
import Body from "./systems/body.js";
window.addEventListener("load", init);
function init() {
    const game = {
        cnvMain: {
            canvas: window.document.querySelector("#main"),
            context: window.document
                .querySelector("#main")
                .getContext("2d"),
            dimensions: { x: 0, y: 0, w: 0, h: 0 },
        },
        cnvMini: {
            canvas: window.document.querySelector("#mini"),
            context: window.document
                .querySelector("#mini")
                .getContext("2d"),
            dimensions: { x: 0, y: 0, w: 0, h: 0 },
        },
        time: 0,
        env: new Array(),
    };
    resizeCanvas(game.cnvMain.canvas);
    game.cnvMain.dimensions.w = game.cnvMain.canvas.width;
    game.cnvMain.dimensions.h = game.cnvMain.canvas.height;
    resizeCanvas(game.cnvMini.canvas);
    game.cnvMini.dimensions.w = game.cnvMini.canvas.width;
    game.cnvMini.dimensions.h = game.cnvMini.canvas.height;
    window.addEventListener("keydown", (event) => {
        console.log(game.cnvMini.dimensions);
        const dX = (game.cnvMain.dimensions.w - game.cnvMini.dimensions.w) / 5;
        const dY = (game.cnvMain.dimensions.h - game.cnvMini.dimensions.h) / 5;
        switch (event.key) {
            case "ArrowDown":
                game.cnvMini.dimensions.y = Math.min(game.cnvMain.dimensions.h - game.cnvMini.dimensions.h, game.cnvMini.dimensions.y + dY);
                break;
            case "ArrowUp":
                game.cnvMini.dimensions.y = Math.max(0, game.cnvMini.dimensions.y - dY);
                break;
            case "ArrowLeft":
                game.cnvMini.dimensions.x = Math.max(0, game.cnvMini.dimensions.x - dX);
                break;
            case "ArrowRight":
                game.cnvMini.dimensions.x = Math.min(game.cnvMain.dimensions.w - game.cnvMini.dimensions.w, game.cnvMini.dimensions.x + dX);
                break;
            default:
                return;
        }
    });
    const center = new Vec2D(game.cnvMain.dimensions.w / 2, game.cnvMain.dimensions.h / 2);
    const randPos = () => new Vec2D(game.cnvMain.dimensions.w * Math.random(), game.cnvMain.dimensions.h * Math.random());
    // TODO: Add systems (bodies)
    game.env.push(new Body({
        radius: 30,
        position: new Vec2D(0, 0),
        velocity: center.div(10),
    }));
    game.time = Date.now();
    console.log(game);
    animate(game);
}
function animate(game) {
    const currentTime = Date.now();
    const dt = (currentTime - game.time) * 1e-3; // Delta time bewteen last 'frame' in seconds
    game.time = currentTime;
    renderAxisBox(game.cnvMain, game.cnvMini);
    const subSteps = 10;
    for (let i = 0; i < subSteps; ++i) {
        for (let j = 0; j < game.env.length; ++j) {
            game.env[j].update(dt, game.env, game.cnvMain.dimensions.w, game.cnvMain.dimensions.h);
            // This might be very bad for performance
            // But better for realism
            game.env[j].applyBehaviors(game.env, dt, game.cnvMain.dimensions.w, game.cnvMain.dimensions.h);
        }
    }
    for (let i = 0; i < game.env.length; ++i) {
        game.env[i].render(game.cnvMain, game.cnvMini);
    }
    requestAnimationFrame(() => animate(game));
}
function renderAxisBox(main, mini) {
    mini.context.save();
    mini.context.fillStyle = "white";
    mini.context.strokeStyle = "black";
    mini.context.rect(0, 0, mini.dimensions.w, mini.dimensions.h);
    mini.context.fill();
    mini.context.stroke();
    mini.context.strokeStyle = "blue";
    mini.context.scale(mini.dimensions.w / main.dimensions.w, mini.dimensions.h / main.dimensions.h);
    mini.context.translate(mini.dimensions.x, mini.dimensions.y);
    mini.context.beginPath();
    mini.context.strokeRect(0, 0, mini.dimensions.w, mini.dimensions.h);
    mini.context.stroke();
    mini.context.restore();
    main.context.save();
    main.context.fillStyle = "white";
    main.context.fillRect(0, 0, main.dimensions.w, main.dimensions.h);
    main.context.fillStyle = "red";
    main.context.scale(main.dimensions.w / mini.dimensions.w, main.dimensions.h / mini.dimensions.h);
    main.context.translate(-mini.dimensions.x, -mini.dimensions.y);
    main.context.beginPath();
    main.context.moveTo;
    main.context.fill();
    main.context.restore();
}
