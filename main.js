// main.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/lil-gui.module.min.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 3);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 2, 3);
scene.add(light);

// Load rotator cuff model
const loader = new GLTFLoader();
loader.load('rotator_cuff.glb', function(gltf) {
  scene.add(gltf.scene);
}, undefined, function(error) {
  console.error(error);
});

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

// Animate
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
