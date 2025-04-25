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
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.LinearToneMapping;
renderer.toneMappingExposure = 1; // tweak if too dark/bright

// LIGHTING — to match the glTF viewer's visibility
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
dirLight.position.set(5, 10, 7.5);
dirLight.castShadow = true;
scene.add(dirLight);


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
        // Compute model's bounding box
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        // Center the camera on the model
        const maxDim = Math.max(size.x, size.y, size.z);
        const fitHeightDistance = maxDim / (2 * Math.atan((Math.PI * camera.fov) / 360));
        const fitWidthDistance = fitHeightDistance / camera.aspect;
        const distance = Math.max(fitHeightDistance, fitWidthDistance);

        // Reposition camera
        camera.position.copy(center);
        camera.position.z += distance * 1.2;
        camera.position.y += distance * 0.2; // optional: a little top-down
        camera.lookAt(center);

        // Update controls
        controls.target.copy(center);
        controls.update();
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

window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Update camera
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(width, height);
});