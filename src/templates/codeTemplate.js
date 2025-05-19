import * as THREE from 'three';
import { setupViewer } from '../components/viewerSetup.js';
import { loadModel } from '../components/modelLoader.js';
import { InteractionHandler } from '../components/interactionHandlers.js';
import {
  registerAnimationHandler,
  setupContentHandlers,
  showContent,
} from '../components/contentHandler.js';
import { getViewerHTML } from './viewerTemplate.js';
import { mountLandscapeBlocker } from '../components/landscapeBlocker.js';
import { log, injectViewerHeadAssets } from '../components/utils.js';
import { AnimationHandler } from '../components/animationHandler.js';
import '../styles/viewer.css';

const FILE_LOG_LEVEL = 'AUTOGEN_MODEL';

export function loadModelByKey(app, key, metadataMap) {
  const metadata = metadataMap[key];
  const displayName = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');

  if (!metadata) {
    log('ERROR', FILE_LOG_LEVEL, `No metadata found for model key: "${key}"`);
    return;
  }

  log('INFO', FILE_LOG_LEVEL, `🚀 ${displayName} Model Loaded (Tailwind Edition)`);

  injectViewerHeadAssets();
  app.innerHTML = getViewerHTML();

  mountLandscapeBlocker();

  const clock = new THREE.Clock();
  const modelContainer = document.getElementById('modelContainer');
  const { scene, camera, renderer, controls } = setupViewer(modelContainer);
  modelContainer.appendChild(renderer.domElement);

  log(
    'DEBUG2',
    FILE_LOG_LEVEL,
    `Viewer initialized with dimensions: ${modelContainer.clientWidth}x${modelContainer.clientHeight}`
  );

  const startTime = performance.now();

  // animationHandler is scoped so it gets disposed when switching models
  let animationHandler = null;

  loadModel(
    scene,
    camera,
    controls,
    metadata.base_model,
    ({ mixer, animations, model }) => {
      const endTime = performance.now();
      const loadTime = ((endTime - startTime) / 1000).toFixed(2);

      const timeBox = document.getElementById('loading-timebox');
      if (timeBox) {
        timeBox.className =
          'fixed bottom-18 right-5 bg-white text-black text-sm font-mono px-4 py-2 rounded-lg shadow-lg z-5';
        timeBox.textContent = `⏱: ${loadTime}s`;
        timeBox.classList.remove('hidden');
        setTimeout(() => {
          if (timeBox) timeBox.classList.add('hidden');
        }, 5000);
      }

      document.getElementById('loadingScreen')?.classList.add('hidden');
      log('DEBUG', FILE_LOG_LEVEL, `Model load time: ${loadTime}s`);

      if (animationHandler) {
        animationHandler.dispose();
        log('DEBUG', FILE_LOG_LEVEL, 'Disposed previous animation handler.');
      }

      animationHandler = new AnimationHandler({
        clips: animations,
        model,
        enable: metadata?.enableAnimation !== false,
      });

      registerAnimationHandler(animationHandler);

      log('DEBUG2', FILE_LOG_LEVEL, `Animation enabled: ${metadata?.enableAnimation !== false}`);
    },
    (xhr) => {
      const { total, loaded } = xhr;
      if (!total || total <= 0) {
        log('DEBUG', FILE_LOG_LEVEL, 'Invalid or missing total size during loading.', xhr);
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
      log('ERROR', FILE_LOG_LEVEL, `❌ Failed to load ${key} model:`, error);
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
    animationHandler ? animationHandler.playByName.bind(animationHandler) : () => {},
    showContent
  );

  setupContentHandlers(metadata);

  function animate() {
    requestAnimationFrame(animate);
    interactionHandler.update();
    controls.update();
    renderer.render(scene, camera);
    const delta = clock.getDelta();
    if (animationHandler) animationHandler.update(delta);
  }
  animate();

  function handleResize() {
    const width = modelContainer.clientWidth;
    const height = modelContainer.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    log('DEBUG2', FILE_LOG_LEVEL, `Viewer resized to: ${width}x${height}`);
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
      animationHandler?.dispose();
      history.pushState({}, '', '/');
      window.dispatchEvent(new Event('popstate'));
    });
  }

  document.getElementById('helpButton').addEventListener('click', () => {
    const helpModal = document.createElement('div');
    helpModal.innerHTML = `
      <div id="help-modal" class="fixed inset-0 bg-black/30 flex items-center justify-center z-50 opacity-0 transition-opacity duration-300 px-4">
        <div id="help-box" class="bg-white rounded-xl shadow-lg p-4 sm:p-6 w-full max-w-md font-mono text-xs sm:text-sm text-gray-800 relative">
          <h2 class="text-base sm:text-lg font-bold mb-2">🧭 How to Use PhysioEase</h2>
          <ul class="list-disc pl-4 space-y-1">
            <li><b>Rotate:</b> Left-click + drag</li>
            <li><b>Change axis:</b> Shift + Left-click + drag</li>
            <li><b>Play/Pause:</b> Top-right controls or spacebar</li>
            <li><b>Step frames:</b> Use &lt;&lt;1ms, &gt;&gt;1ms or <kbd>J</kbd>/<kbd>K</kbd></li>
            <li><b>Change animation:</b> Top-left dropdown</li>
            <li><b>Notes:</b> Saved in browser; cleared on close</li>
          </ul>
          <button id="close-help-modal" class="mt-4 px-3 py-1 border border-gray-400 rounded hover:bg-gray-100 text-xs sm:text-sm">Got it</button>
        </div>
      </div>
    `;

    document.body.appendChild(helpModal);

    // Trigger fade-in
    requestAnimationFrame(() => {
      helpModal.querySelector('#help-modal').classList.remove('opacity-0');
      helpModal.querySelector('#help-modal').classList.add('opacity-100');
    });

    const modal = document.getElementById('help-modal');

    // Close button
    document.getElementById('close-help-modal').addEventListener('click', () => {
      closeModal(modal);
    });

    // Click outside to close
    modal.addEventListener('click', (e) => {
      const helpBox = document.getElementById('help-box');
      if (!helpBox.contains(e.target)) {
        closeModal(modal);
      }
    });

    function closeModal(modalEl) {
      modalEl.classList.remove('opacity-100');
      modalEl.classList.add('opacity-0');
      setTimeout(() => modalEl.remove(), 300);
    }
  });
}
