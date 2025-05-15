import * as THREE from 'three';
import { setupViewer } from '../components/viewerSetup.js';
import { loadModel } from '../components/modelLoader.js';
import { InteractionHandler } from '../components/interactionHandlers.js';
import {
  setupContentHandlers,
  playAnimationPanel,
  showContent,
} from '../components/contentHandler.js';
import { updateDebugDimensions } from '../components/uiHelpers.js';
import { getViewerHTML } from '../templates/viewerTemplate.js';
import { mountLandscapeBlocker } from '../components/landscapeBlocker.js';
import { log, injectViewerHeadAssets } from '../components/utils.js';
import { ANKLE_METADATA } from '../components/config.js';
import { setupAnimationHandler, updateAnimationHandler } from '../components/animationHandler.js';
import '../styles/viewer.css';

log('INFO', '🚀 Ankle Model Loaded (Tailwind Edition)');

const clock = new THREE.Clock();

export function loadAnkle(app) {
  injectViewerHeadAssets();

  app.innerHTML = getViewerHTML();
  mountLandscapeBlocker();

  const modelContainer = document.getElementById('modelContainer');
  const { scene, camera, renderer, controls } = setupViewer(modelContainer);

  modelContainer.appendChild(renderer.domElement);

  loadModel(
    scene,
    camera,
    controls,
    ANKLE_METADATA.base_model,
    ({ mixer, animations }) => {
      document.getElementById('loadingScreen').classList.add('hidden');
      setupAnimationHandler(mixer, animations);
    },
    (xhr) => {
      const total = xhr.total;
      const loaded = xhr.loaded;

      if (!total || total <= 0) {
        console.warn('⚠️ Invalid or missing total size during loading.', xhr);
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
      const screen = document.getElementById('loadingScreen');
      if (screen) screen.innerHTML = '❌ Failed to load ankle model.';
    }
  );

  const interactionHandler = new InteractionHandler(
    scene,
    camera,
    renderer.domElement,
    ANKLE_METADATA,
    (clickedObject) => {
      // Optional: handle click events
    },
    playAnimationPanel,
    showContent
  );

  setupContentHandlers(ANKLE_METADATA);

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
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    updateDebugDimensions();
  }

  window.addEventListener('resize', handleResize);

  const terminalHome = document.getElementById('terminalHome');
  if (terminalHome) {
    terminalHome.addEventListener('click', (e) => {
      e.preventDefault();
      cancelAnimationFrame(animate);
      renderer.dispose();
      renderer.domElement.remove();
      window.removeEventListener('resize', handleResize);
      history.pushState({}, '', '/');
      window.dispatchEvent(new Event('popstate'));
    });
  }

  updateDebugDimensions();
}
