import { setupViewer } from '../components/viewerSetup.js';
import { loadModel } from '../components/modelLoader.js';
import { setupInteractions } from '../components/interactionHandlers.js';
import { setupVideoHandlers } from '../components/videoHandlers.js';
import { updateDebugDimensions } from '../components/uiHelpers.js';
import { getRotatorCuffHTML } from '../templates/rotatorcuffTemplate.js';
import '../styles/rotatorcuff.css';

console.log('🚀 PhysioEase 3D viewer loaded');

export function loadRotatorCuff(app) {
  app.innerHTML = getRotatorCuffHTML();

  const modelContainer = document.getElementById('modelContainer');
  const { scene, camera, renderer, controls } = setupViewer(modelContainer);

  modelContainer.appendChild(renderer.domElement);

  // Start loading model
  loadModel(
    scene,
    camera,
    controls,
    () => {
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
      console.error('❌ Failed to load model:', error);
      document.getElementById('loadingScreen').innerHTML = '❌ Failed to load model.';
    }
  );

  setupInteractions(scene, camera, renderer.domElement);
  setupVideoHandlers();

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  function handleResize() {
    const width = modelContainer.clientWidth;
    const height = modelContainer.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    updateDebugDimensions();
  }

  window.addEventListener('resize', handleResize);

  // Handle Back Home
  document.getElementById('terminalHome')?.addEventListener('click', (e) => {
    e.preventDefault();
    cancelAnimationFrame(animate);
    renderer.dispose();
    renderer.domElement.remove();
    window.removeEventListener('resize', handleResize);
    history.pushState({}, '', '/');
    window.dispatchEvent(new Event('popstate'));
  });

  updateDebugDimensions();
}
