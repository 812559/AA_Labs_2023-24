export var Utils;
(function (Utils) {
    function resizeCanvas(canvas) {
        const pxRatio = window.devicePixelRatio || 1;
        canvas.width = canvas.clientWidth * pxRatio;
        canvas.height = canvas.clientHeight * pxRatio;
    }
    Utils.resizeCanvas = resizeCanvas;
    function mod(a, b) {
        return a - b * Math.floor(a / b);
    }
    Utils.mod = mod;
})(Utils || (Utils = {}));
