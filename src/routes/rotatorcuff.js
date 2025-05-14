import * as THREE from 'three';
import { setupViewer } from '../components/viewerSetup.js';
import { loadModel } from '../components/modelLoader.js';
import { InteractionHandler } from '../components/interactionHandlers.js';
import { setupContentHandlers } from '../components/contentHandler.js';
import { updateDebugDimensions } from '../components/uiHelpers.js';
import { getViewerHTML } from '../templates/viewerTemplate.js';
import { mountLandscapeBlocker } from '../components/landscapeBlocker.js';
import { log } from '../components/utils.js';
import { ROTATORCUFF_METADATA } from '../components/config.js';
import { playAnimationPanel, showContent } from '../components/contentHandler.js';
import { setupAnimationHandler, updateAnimationHandler } from '../components/animationHandler.js';
import '../styles/viewer.css';

log('INFO', '🚀 Rotator Cuff Model Loaded');

const clock = new THREE.Clock();

export function loadRotatorCuff(app) {
  const styleId = 'viewer-css-link';
  if (!document.getElementById(styleId)) {
    const link = document.createElement('link');
    link.id = styleId;
    link.rel = 'stylesheet';
    link.href = '/src/styles/viewer.css';
    document.head.appendChild(link);
  }

  app.innerHTML = getViewerHTML();
  mountLandscapeBlocker();

  const modelContainer = document.getElementById('modelContainer');
  const { scene, camera, renderer, controls } = setupViewer(modelContainer);

  modelContainer.appendChild(renderer.domElement);

  loadModel(
    scene,
    camera,
    controls,
    ROTATORCUFF_METADATA.base_model,
    ({ mixer, animations }) => {
      document.getElementById('loadingScreen').classList.add('hidden');
      setupAnimationHandler(mixer, animations);
    },
    (xhr) => {
      const total = xhr.total;
      const loaded = xhr.loaded;

      // Guard against bad totals
      if (!total || total <= 0) {
        console.warn('⚠️ Warning: Invalid total size during model loading.', xhr);
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
      console.error('❌ Failed to load model:', error);
      document.getElementById('loadingScreen').innerHTML = '❌ Failed to load model.';
    }
  );

  const interactionHandler = new InteractionHandler(
    scene,
    camera,
    renderer.domElement,
    ROTATORCUFF_METADATA,
    (clickedObject) => {},
    playAnimationPanel,
    showContent
  );
  setupContentHandlers(ROTATORCUFF_METADATA);

  function animate() {
    requestAnimationFrame(animate);
    interactionHandler.update();
    controls.update();
    renderer.render(scene, camera);
    const delta = clock.getDelta();
    updateAnimationHandler(delta);
  }
  animate();

  function handleResize() {
    const width = modelContainer.clientWidth;
    const height = modelContainer.clientHeight;
    camera.aspect = width / height;
    camera.position.z += 1;
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
