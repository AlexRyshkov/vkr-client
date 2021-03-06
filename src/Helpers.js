import * as d3 from "d3";

function generateRandomPoints(n) {
    let points = [];
    for (let i = 0; i < n; i++) {
        points.push({x: randomFloat(-1, 1), y: randomFloat(-1, 1), z: randomFloat(0, 100)});
    }
    return points;
}

function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
};

function generateClusters(n) {
    let clusters = [];
    const minimum = 0;
    const maximum = 2;
    for (let i = 0; i < n; i++) {
        clusters.push(Math.floor(Math.random() * (maximum - minimum + 1)) + minimum);
    }
    return clusters;
}

function linspace(a, b, n) {
    return d3.range(n).map(function (i) {
        return a + i * (b - a) / (n - 1);
    });
}