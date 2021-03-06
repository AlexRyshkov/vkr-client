import * as THREE from "three";
import {useEffect} from 'react';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import SpriteText from 'three-spritetext';

let camera, controls, scene, renderer, sceneDOM;
let particles;
const PARTICLE_SIZE = 5;

const axisLength = 200;
const clusterColors = [
    0xff0000,
    0x00ff00,
    0x0000ff,
    0xfff828,
    0x56d6ff,
    0xf6aaff,
    0x28ffe2,
    0xff7400,
    0xa4a4a4,
    0x04119a
];

function init(data) {
    const {x, y, z, labels, clustersCount, pointsCount} = data;
    sceneDOM = document.getElementById('scatter3D');
    sceneDOM.innerHTML = '';
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(sceneDOM.clientWidth, sceneDOM.clientHeight);
    sceneDOM.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(60, sceneDOM.clientWidth / sceneDOM.clientHeight, 1, 1600);
    camera.position.set(250, 250, 250);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.listenToKeyEvents(window); // optional

    controls.addEventListener('change', render); // call this only in static scenes (i.e., if there is no animation loop)

    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05;

    controls.screenSpacePanning = false;

    controls.minDistance = 100;
    controls.maxDistance = 500;

    controls.maxPolarAngle = Math.PI / 2;

    const sprite = new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/sprites/disc.png');
    const xMin = Math.min(...x.coords);
    const xMax = Math.max(...x.coords);
    const yMin = Math.min(...y.coords);
    const yMax = Math.max(...y.coords);
    const zMin = Math.min(...z.coords);
    const zMax = Math.max(...z.coords);

    drawLine([new THREE.Vector3(0, 0, 0), new THREE.Vector3(axisLength, 0, 0)]);
    drawLine([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, axisLength, 0)]);
    drawLine([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, axisLength)]);

    drawLabel(x.label, axisLength, 0, 0, 5);
    drawLabel(y.label, 0, axisLength, 0, 5);
    drawLabel(z.label, 0, 0, axisLength, 5);

    drawXAxisScale(xMin, xMax, 5);
    drawYAxisScale(yMin, yMax, 5);
    drawZAxisScale(zMin, zMax, 5);

    const geometry = new THREE.BufferGeometry();
    const color = new THREE.Color();

    const xCoords = x.coords.map(value => normalizeValue(value, xMin, xMax));
    const yCoords = y.coords.map(value => normalizeValue(value, yMin, yMax));
    const zCoords = z.coords.map(value => normalizeValue(value, zMin, zMax));
    let points = [];
    let colors = [];
    for (let i = 0; i < pointsCount; i++) {
        points.push(xCoords[i], yCoords[i], zCoords[i]);
        color.setHex(clusterColors[labels[i]]);
        colors.push(color.r, color.g, color.b);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: PARTICLE_SIZE,
        sizeAttenuation: true,
        map: sprite,
        alphaTest: 0.5,
        transparent: true,
        vertexColors: true
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    window.addEventListener('resize', onWindowResize);
}

function drawLine(points) {
    const material = new THREE.LineBasicMaterial({color: 0x0000ff});
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    scene.add(line);
}

function drawLabel(text, x, y, z, textHeight = 10) {
    let label = new SpriteText(text);
    label.textHeight = textHeight;
    label.position.x = x;
    label.position.y = y;
    label.position.z = z;
    label.color = '#000000';
    scene.add(label);
}

function drawXAxisScale(min, max, n) {
    let step = (max - min) / n;
    for (let i = 1; i < n; i++) {
        let x = min + step * i;
        let label = x.toFixed(2);
        x = normalizeValue(x, min, max);
        drawLabel(label, x, -5, 0, 5);
        drawLine([new THREE.Vector3(x, -2, 0), new THREE.Vector3(x, 2, 0)]);
    }
}

function drawYAxisScale(min, max, n) {
    let step = (max - min) / n;
    for (let i = 1; i < n; i++) {
        let y = min + step * i;
        let label = y.toFixed(2);
        y = normalizeValue(y, min, max);
        drawLabel(label, -5, y, 0, 5);
        drawLine([new THREE.Vector3(-2, y, 0), new THREE.Vector3(2, y, 0)]);
    }
}

function drawZAxisScale(min, max, n) {
    let step = (max - min) / n;
    for (let i = 1; i < n; i++) {
        let z = min + step * i;
        let label = z.toFixed(2);
        z = normalizeValue(z, min, max);
        drawLabel(label, 0, -5, z, 5);
        drawLine([new THREE.Vector3(0, -2, z), new THREE.Vector3(0, 2, z)]);
    }
}

function normalizeValue(value, prevMin, prevMax, newMin = 0, newMax = axisLength) {
    return newMin + ((value - prevMin) / (prevMax - prevMin)) * (newMax - newMin);
}

function onWindowResize() {
    camera.aspect = sceneDOM.clientWidth / sceneDOM.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(sceneDOM.clientWidth, sceneDOM.clientHeight);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    render();
}

function render() {
    renderer.render(scene, camera);
}

function clearThree(obj) {
    while (obj.children.length > 0) {
        clearThree(obj.children[0])
        obj.remove(obj.children[0]);
    }
    if (obj.geometry) obj.geometry.dispose()

    if (obj.material) {
        //in case of map, bumpMap, normalMap, envMap ...
        Object.keys(obj.material).forEach(prop => {
            if (!obj.material[prop])
                return
            if (obj.material[prop] !== null && typeof obj.material[prop].dispose === 'function')
                obj.material[prop].dispose()
        })
        obj.material.dispose()
    }
}

function Scatter3D({data}) {
    useEffect(() => {
        init(data);
        //render(); // remove when using next line for animation loop (requestAnimationFrame)
        animate();
        return () => {
            clearThree(scene);
        }
    }, [data]);

    return (<></>);
}

export default Scatter3D;
