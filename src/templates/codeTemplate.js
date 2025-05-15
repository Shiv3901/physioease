// ../templates/codeTemplate.js

import * as THREE from 'three';
import { setupViewer } from '../components/viewerSetup.js';
import { loadModel } from '../components/modelLoader.js';
import { InteractionHandler } from '../components/interactionHandlers.js';
import {
  setupContentHandlers,
  playAnimationPanel,
  showContent,
} from '../components/contentHandler.js';
import { getViewerHTML } from './viewerTemplate.js';
import { mountLandscapeBlocker } from '../components/landscapeBlocker.js';
import { log, injectViewerHeadAssets } from '../components/utils.js';
import { setupAnimationHandler, updateAnimationHandler } from '../components/animationHandler.js';
import '../styles/viewer.css';

export function loadModelByKey(app, key, metadataMap) {
  const metadata = metadataMap[key];
  const displayName = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');

  if (!metadata) {
    console.error(`❌ No metadata found for model key: "${key}"`);
    app.innerHTML = `<div class="text-red-500 p-4">❌ No model metadata found for "${key}".</div>`;
    return;
  }

  log('INFO', `🚀 ${displayName} Model Loaded (Tailwind Edition)`);

  injectViewerHeadAssets();
  app.innerHTML = getViewerHTML();
  mountLandscapeBlocker();

  const clock = new THREE.Clock();
  const modelContainer = document.getElementById('modelContainer');
  const { scene, camera, renderer, controls } = setupViewer(modelContainer);
  modelContainer.appendChild(renderer.domElement);

  loadModel(
    scene,
    camera,
    controls,
    metadata.base_model,
    ({ mixer, animations }) => {
      document.getElementById('loadingScreen')?.classList.add('hidden');
      setupAnimationHandler(mixer, animations);
    },
    (xhr) => {
      const { total, loaded } = xhr;
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
      console.error(`❌ Failed to load ${key} model:`, error);
      const screen = document.getElementById('loadingScreen');
      if (screen) screen.innerHTML = `❌ Failed to load ${displayName} model.`;
    }
  );

  const interactionHandler = new InteractionHandler(
    scene,
    camera,
    renderer.domElement,
    metadata,
    (clickedObject) => {
      // Optional: click logic
    },
    playAnimationPanel,
    showContent
  );

  setupContentHandlers(metadata);

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
}
