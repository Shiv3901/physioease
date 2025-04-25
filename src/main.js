import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

console.log("🚀 PhysioEase 3D viewer loaded");

// info to display
const muscleInfo = {
  Supraspinatus: "The supraspinatus is part of the rotator cuff and helps with shoulder abduction.",
  Infraspinatus: "The infraspinatus externally rotates the shoulder and stabilizes the joint.",
  Subscapularis: "The subscapularis helps internally rotate the arm and stabilize the shoulder.",
  TeresMinor: "The teres minor assists with external rotation of the shoulder.",
  Humerus: "The humerus is the long bone of the upper arm, connecting the shoulder to the elbow.",
  Clavicle: "The clavicle, or collarbone, connects the arm to the body and helps stabilize the shoulder.",
  Scapula: "The scapula, or shoulder blade, provides attachment points for muscles and stabilizes the shoulder.",
};

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

let hoveredMesh = null;
let selectedMesh = null;

const labelEl = document.getElementById('selectedLabel');
const popup = document.getElementById('popup');


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

        model.traverse((child) => {
          if (child.isMesh) {
            console.log(`🧠 Mesh found: "${child.name}"`);
          }
        });

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

let lastHovered = null;

function highlightMesh(mesh) {
  if (selectedMesh && selectedMesh.material && selectedMesh.originalColor) {
    selectedMesh.material.color.set(selectedMesh.originalColor);
  }

  if (mesh && mesh.material) {
    if (!mesh.originalColor) {
      mesh.originalColor = mesh.material.color.clone();
    }
    mesh.material.color.set(0xffff00); // highlight color
    selectedMesh = mesh;

    const name = mesh.name || 'Unnamed';
    labelEl.textContent = `🧠 Selected: ${name}`;
  }
}

renderer.domElement.addEventListener('pointermove', (event) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    const hovered = intersects[0].object;

    if (hovered !== hoveredMesh && hovered !== selectedMesh) {
      if (hoveredMesh && hoveredMesh !== selectedMesh && hoveredMesh.originalColor) {
        hoveredMesh.material.color.set(hoveredMesh.originalColor);
      }

      hoveredMesh = hovered;

      if (!hovered.originalColor) {
        hovered.originalColor = hovered.material.color.clone();
      }

      if (hovered !== selectedMesh) {
        hovered.material.color.set(0xffff00); // yellow for hover
      }
    }
  } else {
    // Clear previous hover highlight if it's not the selected one
    if (hoveredMesh && hoveredMesh !== selectedMesh && hoveredMesh.originalColor) {
      hoveredMesh.material.color.set(hoveredMesh.originalColor);
    }
    hoveredMesh = null;
  }
});

renderer.domElement.addEventListener('pointerdown', (event) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    const clicked = intersects[0].object;

    // Clicked the same already-selected mesh? Deselect it
    if (clicked === selectedMesh) {
      // Reset color
      if (selectedMesh.originalColor) {
        selectedMesh.material.color.set(selectedMesh.originalColor);
      }
      selectedMesh = null;
      labelEl.textContent = `🧠 Selected: None`;
      popup.style.display = 'none';
      return;
    }

    // Un-highlight previous selection
    if (selectedMesh && selectedMesh.originalColor) {
      selectedMesh.material.color.set(selectedMesh.originalColor);
    }

    // Select new
    selectedMesh = clicked;

    if (!clicked.originalColor) {
      clicked.originalColor = clicked.material.color.clone();
    }
    clicked.material.color.set(0x00ff00); // green

    // Show UI
    const name = clicked.name || 'Unnamed';
    labelEl.textContent = `🧠 Selected: ${name}`;
    popup.innerHTML = `<strong>${name}</strong><br>${muscleInfo[name] || "No info available."}`;
    popup.style.display = 'block';
  } else {
    // Clicked empty space — clear selection
    if (selectedMesh && selectedMesh.originalColor) {
      selectedMesh.material.color.set(selectedMesh.originalColor);
    }
    selectedMesh = null;
    labelEl.textContent = `🧠 Selected: None`;
    popup.style.display = 'none';
  }
});
