import { setupViewer } from '../components/viewerSetup.js';
import { loadModel } from '../components/modelLoader.js';
import { InteractionHandler } from '../components/interactionHandlers.js';
import { setupVideoHandlers } from '../components/videoHandlers.js';
import { updateDebugDimensions } from '../components/uiHelpers.js';
import { getViewerHTML } from '../templates/viewerTemplate.js';
import { mountLandscapeBlocker } from '../components/landscapeBlocker.js';
import { log } from '../components/utils.js';
import '../styles/viewer.css';
import { ANKLE_METADATA } from '../constants.js';

log('INFO', '🚀 Ankle Model Loaded');

export function loadAnkle(app) {
  app.innerHTML = getViewerHTML();
  mountLandscapeBlocker();

  const modelContainer = document.getElementById('modelContainer');
  const { scene, camera, renderer, controls } = setupViewer(modelContainer);

  modelContainer.appendChild(renderer.domElement);

  loadModel(
    scene,
    camera,
    controls,
    './models/ankle-compressed.glb',
    () => {
      document.getElementById('loadingScreen').style.display = 'none';
    },
    (xhr) => {
      const total = xhr.total;
      const loaded = xhr.loaded;

      if (!total || total <= 0) {
        console.warn('⚠️ Warning: Invalid or missing total size during ankle model loading.', xhr);
        return;
      }

      const percent = (loaded / total) * 100;
      const rounded = percent.toFixed(0);
      const bar = document.getElementById('asciiBar');
      const label = document.getElementById('loadingPercent');

      if (bar && label) {
        const totalBlocks = 10;
        const filled = Math.min(
          totalBlocks,
          Math.max(0, Math.round((percent / 100) * totalBlocks))
        );
        const empty = totalBlocks - filled;
        bar.textContent = `[${'█'.repeat(filled)}${'-'.repeat(empty)}]`;
        label.textContent = `${rounded}%`;
      }
    },
    (error) => {
      console.error('❌ Failed to load ankle model:', error);
      document.getElementById('loadingScreen').innerHTML = '❌ Failed to load ankle model.';
    }
  );

  const interactionHandler = new InteractionHandler(
    scene,
    camera,
    renderer.domElement,
    ANKLE_METADATA,
    (clickedObject) => {}
  );
  setupVideoHandlers(ANKLE_METADATA);

  function animate() {
    requestAnimationFrame(animate);
    interactionHandler.update();
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
