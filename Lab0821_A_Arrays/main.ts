function loadArray(n: number, min: number, max: number) {
    let a = new Array(n);
    for (let i = 0; i < n; ++i) {
        a[i] = Math.floor(min + Math.random() * (max - min + 1));
    }
    return a;
}

function mean(a: Array<number>): number {
    return a.reduce((a, v) => a + v) / a.length;
}

function median(a: Array<number>):number {
    let sorted = Array.from(a).sort((a, b) => a - b);
    let m = Math.floor(a.length / 2);
    if (a.length % 2 == 0) {
        return (sorted[m] + sorted[m - 1] ) / 2;
    } else {
        return sorted[m];
    }
}

function mode(a: Array<number>): Array<number> {
    let occurrences = new Map<number, number>();
    a.forEach((v) => {
        if (occurrences.has(v)) {
            occurrences.set(v, occurrences.get(v)! +  1);
        } else {
            occurrences.set(v, 1)
        }
    });
    let max = 0, modes: Array<number> = [];
    occurrences.forEach((o, v) => {
        if (o > max) {
            max = o;
            modes = [];
            modes.push(v);
        } else if (o == max) {
            modes.push(v);
        }
    });
    return modes;
}

function main() {
    let arr = loadArray(20, 10, 20);
    console.log(arr);
    console.log(mean(arr));
    console.log(median(arr));
    console.log(mode(arr));
}

main();

