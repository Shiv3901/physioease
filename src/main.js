import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

console.log("🚀 PhysioEase 3D viewer loaded");

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff); // 🔁 White background

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const light = new THREE.DirectionalLight(0xffffff, 0.9);
light.position.set(3, 3, 3);
scene.add(light);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Load Model
const modelPath = '/models/rotator-cuff.glb';

fetch(modelPath, { method: 'HEAD' })
  .then((res) => {
    if (!res.ok) throw new Error(`Model not found: ${res.status}`);
    console.log(`✅ Model file found at ${modelPath}`);

    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;
        model.position.set(0, -1, 0);
        model.scale.set(1.5, 1.5, 1.5);
        scene.add(model);
        console.log('✅ Model loaded');
      },
      (xhr) => {
        console.log(`📦 Model loading: ${((xhr.loaded / xhr.total) * 100).toFixed(1)}%`);
      },
      (error) => {
        console.error('❌ GLTFLoader failed:', error);
      }
    );
  })
  .catch((err) => {
    console.error('🚨 Failed to load model:', err);
  });

// Animate
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
