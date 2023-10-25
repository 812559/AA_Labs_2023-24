export function resizeCanvas(canvas) {
    const pxRatio = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * pxRatio;
    canvas.height = canvas.clientHeight * pxRatio;
    // canvas.getContext("2d")?.scale(pxRatio, pxRatio);
}
export function mod(a, b) {
    return a - b * Math.floor(a / b);
}
export const TAU = Math.PI * 2;
export class Color {
    r;
    g;
    b;
    a;
    constructor(r, g, b, a) {
        this.r = r ?? 0;
        this.g = g ?? 0;
        this.b = b ?? 0;
        this.a = a ?? 1;
    }
    /**
     * Create a color from an hsv value
     * @param h 0 <= hue <= 360
     * @param s 0 <= saturation <= 1
     * @param v 0 <= value (brightness) <= 1
     * @returns the rgb equilvalent
     */
    static hsv(h, s, v) {
        // https://stackoverflow.com/a/54024653
        const f = (n, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
        return new Color(f(5) * 255, f(3) * 255, f(1) * 255, 1);
    }
    /**
     * Create a color from a hexcode
     * @param hexcode the hexcode Eg. 0x00ff1d
     */
    static hex(hexcode) {
        // Simple string to number, then bitshift (that I totally understand)
        // https://stackoverflow.com/a/21648508
        let code = typeof hexcode === "string"
            ? parseInt(hexcode.replace("#", "0x"), 16)
            : Math.floor(hexcode);
        return new Color((code >> 16) & 255, (code >> 8) & 255, code & 255, 1);
    }
    static RED = new Color(255, 0, 0);
    static GREEN = new Color(0, 255, 0);
    static BLUE = new Color(0, 0, 255);
    static BLACK = new Color(0, 0, 0);
    static WHITE = new Color(255, 255, 255);
    setR(r) {
        return new Color(r, this.g, this.b, this.a);
    }
    setG(g) {
        return new Color(this.r, g, this.b, this.a);
    }
    setB(b) {
        return new Color(this.r, this.g, b, this.a);
    }
    setA(a) {
        return new Color(this.r, this.g, this.b, a);
    }
    toString() {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }
}
