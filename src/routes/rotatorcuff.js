import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import '../styles/rotatorcuff.css';
import { getRotatorCuffHTML } from '../templates/rotatorcuffTemplate.js';

console.log('🚀 PhysioEase 3D viewer loaded');

export function loadRotatorCuff(app) {
  app.innerHTML = getRotatorCuffHTML();

  // Grab elements
  const popup = document.getElementById('popup');
  const labelEl = document.getElementById('selectedLabel');
  const videoLinks = document.getElementById('videoLinks');
  const videoArea = document.getElementById('videoArea');
  const exerciseVideo = document.getElementById('exerciseVideo');
  const closeVideoBtn = document.getElementById('closeVideoBtn');
  const videoSource = exerciseVideo.querySelector('source');
  const viewerArea = document.getElementById('viewerArea'); // 🆕 Where canvas will go

  // 3D Setup
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  const camera = new THREE.PerspectiveCamera(
    75,
    viewerArea.clientWidth / viewerArea.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 1, 5);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(viewerArea.clientWidth, viewerArea.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.LinearToneMapping;
  renderer.toneMappingExposure = 1;

  viewerArea.appendChild(renderer.domElement); // 🆕 append to correct div
  const canvasElement = renderer.domElement;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let hoveredMesh = null;
  let selectedMesh = null;
  let animationId;

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
  dirLight.position.set(5, 10, 7.5);
  dirLight.castShadow = true;
  scene.add(dirLight);

  function animate() {
    animationId = requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // Information data
  const muscleInfo = {
    Supraspinatus: 'The supraspinatus helps shoulder abduction.',
    Infraspinatus: 'The infraspinatus externally rotates the shoulder.',
    Subscapularis: 'The subscapularis internally rotates the arm.',
    TeresMinor: 'The teres minor assists with external rotation.',
    Humerus: 'The humerus connects the shoulder to elbow.',
    Clavicle: 'The clavicle connects arm to body and stabilizes shoulder.',
    Scapula: 'The scapula stabilizes and moves the shoulder.',
  };

  const videoData = {
    Supraspinatus: {
      normal: '/videos/demo.mp4', // Placeholder demo video
      rehab: '/videos/demo.mp4', // Placeholder demo video
    },
    Infraspinatus: {
      normal: '/videos/demo.mp4',
      rehab: '/videos/demo.mp4',
    },
    Subscapularis: {
      normal: '/videos/demo.mp4',
      rehab: '/videos/demo.mp4',
    },
    TeresMinor: {
      normal: '/videos/demo.mp4',
      rehab: '/videos/demo.mp4',
    },
    Humerus: {
      normal: '/videos/demo.mp4',
      rehab: '/videos/demo.mp4',
    },
  };

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
              child.material = child.material.clone();
              if (child.material.map) {
                child.material.map = child.material.map.clone();
              }
            }
          });

          // Fit model nicely
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const distance = maxDim / (2 * Math.atan((Math.PI * camera.fov) / 360));
          camera.position.copy(center);
          camera.position.z += distance * 1.2;
          camera.position.y += distance * 0.2;
          camera.lookAt(center);

          controls.target.copy(center);
          controls.update();

          console.log('✅ Model loaded');
          document.getElementById('loadingScreen').style.display = 'none';
        },
        (xhr) => {
          const percent = (xhr.loaded / xhr.total) * 100;
          const rounded = percent.toFixed(0);
          const bar = document.getElementById('asciiBar');
          const label = document.getElementById('loadingPercent');
          if (bar && label) {
            const totalBlocks = 10;
            const filled = Math.round((rounded / 100) * totalBlocks);
            const empty = totalBlocks - filled;
            bar.textContent = `[${'█'.repeat(filled)}${'-'.repeat(empty)}]`;
            label.textContent = `${rounded}%`;
          }
        },
        (error) => {
          console.error('❌ GLTFLoader failed:', error);
          document.getElementById('loadingScreen').innerHTML = '❌ Failed to load model.';
        }
      );
    })
    .catch((err) => {
      console.error('🚨 Failed to load model:', err);
    });

  // Handlers
  function moveHandler(event) {
    const rect = canvasElement.getBoundingClientRect();

    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      const hovered = intersects[0].object;

      // Only react if not same as previously hovered or selected
      if (hovered !== hoveredMesh && hovered !== selectedMesh) {
        // Reset previous hover color if needed
        if (
          hoveredMesh &&
          hoveredMesh !== selectedMesh &&
          hoveredMesh.originalColor &&
          hoveredMesh.material
        ) {
          hoveredMesh.material.color.set(hoveredMesh.originalColor);
        }

        hoveredMesh = hovered;

        // Clone color if first time
        if (!hovered.originalColor && hovered.material && hovered.material.color) {
          hovered.originalColor = hovered.material.color.clone();
        }

        // Apply hover highlight
        if (hovered.material && hovered !== selectedMesh) {
          hovered.material.color.set(0xffff00); // yellow
        }
      }
    } else {
      // No intersections — reset hover color if needed
      if (
        hoveredMesh &&
        hoveredMesh !== selectedMesh &&
        hoveredMesh.originalColor &&
        hoveredMesh.material
      ) {
        hoveredMesh.material.color.set(hoveredMesh.originalColor);
      }
      hoveredMesh = null;
    }
  }

  function downHandler(event) {
    const rect = canvasElement.getBoundingClientRect();

    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    console.log('🧪 Raycasting intersects:', intersects.length);

    if (intersects.length > 0) {
      const clicked = intersects[0].object;
      const name = clicked.name || 'Unnamed';

      if (clicked === selectedMesh) {
        if (selectedMesh.originalColor) selectedMesh.material.color.set(selectedMesh.originalColor);
        selectedMesh = null;
        labelEl.textContent = `🧠 Selected: None`;
        popup.style.display = 'none';
        videoLinks.style.display = 'none';
        return;
      }

      if (selectedMesh && selectedMesh.originalColor)
        selectedMesh.material.color.set(selectedMesh.originalColor);

      selectedMesh = clicked;
      if (!clicked.originalColor) clicked.originalColor = clicked.material.color.clone();
      clicked.material.color.set(0x00ff00);

      labelEl.textContent = `🧠 Selected: ${name}`;
      popup.innerHTML = `${muscleInfo[name] || 'No info available.'}`;
      popup.style.display = 'block';

      if (videoData[name]) {
        videoLinks.innerHTML = `
          <a href="${videoData[name].normal}" class="video-box" target="_blank">🎥 Normal Movement</a>
          <a href="${videoData[name].rehab}" class="video-box" target="_blank">🛠️ Rehab Exercises</a>
        `;
        videoLinks.style.display = 'flex';
      } else {
        videoLinks.style.display = 'none';
      }

      exerciseVideo.pause();
      exerciseVideo.currentTime = 0;
      videoSource.src = '';
      videoArea.style.display = 'none';
    } else {
      if (selectedMesh && selectedMesh.originalColor)
        selectedMesh.material.color.set(selectedMesh.originalColor);
      selectedMesh = null;
      labelEl.textContent = `🧠 Selected: None`;
      popup.style.display = 'none';
      videoLinks.style.display = 'none';
      videoArea.style.display = 'none';
      exerciseVideo.pause();
      exerciseVideo.currentTime = 0;
      videoSource.src = '';
    }
  }

  canvasElement.addEventListener('pointermove', moveHandler);
  canvasElement.addEventListener('pointerdown', downHandler);

  // Video Link click
  videoLinks.addEventListener('click', (e) => {
    if (e.target.classList.contains('video-box')) {
      e.preventDefault();
      const href = e.target.getAttribute('href');

      if (href && href !== '#') {
        videoSource.src = href;
        exerciseVideo.load();
        exerciseVideo.muted = true; // Make sure it's muted by default

        // Show video on large screens (right side) and full screen on small screens
        if (window.innerWidth >= 768) {
          videoArea.style.display = 'flex'; // Show on the right side
        } else {
          videoArea.classList.add('full-screen');
          videoArea.style.display = 'flex'; // Full-screen layout for small screens
        }
      }
    }
  });

  closeVideoBtn.addEventListener('click', () => {
    exerciseVideo.pause();
    exerciseVideo.currentTime = 0;
    videoSource.src = '';
    videoArea.style.display = 'none'; // Hide video area when clicked
  });

  // Handle Resize
  // 1. Define the resizeHandler function
  const resizeHandler = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };

  // 2. Attach resizeHandler to window resize event
  window.addEventListener('resize', resizeHandler);

  // Back Home button
  document.getElementById('terminalHome')?.addEventListener('click', (e) => {
    e.preventDefault();

    cancelAnimationFrame(animationId);
    renderer.dispose();
    renderer.domElement.remove();

    window.removeEventListener('resize', resizeHandler);
    canvasElement?.removeEventListener('pointermove', moveHandler);
    canvasElement?.removeEventListener('pointerdown', downHandler);

    history.pushState({}, '', '/');
    window.dispatchEvent(new Event('popstate'));
  });
}
