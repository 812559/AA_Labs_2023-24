export function resizeCanvas(canvas) {
    const pxRatio = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * pxRatio;
    canvas.height = canvas.clientHeight * pxRatio;
}
export function mod(a, b) {
    return a - b * Math.floor(a / b);
}
export const TAU = Math.PI * 2;
