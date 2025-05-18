import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { log } from './utils.js';

const FILE_LOG_LEVEL = 'MODEL_LOADER';

export function centerModel(model, camera, controls) {
  log('DEBUG2', FILE_LOG_LEVEL, 'Centering model based on bounding box.');

  const box = new THREE.Box3().setFromObject(model);
  log(
    'DEBUG2',
    FILE_LOG_LEVEL,
    `Bounding box min: ${box.min.toArray()}, max: ${box.max.toArray()}`
  );

  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  log('DEBUG2', FILE_LOG_LEVEL, `Calculated center: ${center.toArray()}, size: ${size.toArray()}`);

  const distance = Math.max(size.x, size.y, size.z) / (2 * Math.atan((Math.PI * camera.fov) / 360));
  log('DEBUG2', FILE_LOG_LEVEL, `Calculated camera distance: ${distance}`);

  camera.position.copy(center);
  camera.position.z += distance * 1.2;
  camera.position.y += distance * 0.2;
  camera.lookAt(center);

  log('DEBUG2', FILE_LOG_LEVEL, `Camera positioned at: ${camera.position.toArray()}`);
  controls.target.copy(center);
  controls.update();

  log(
    'DEBUG2',
    FILE_LOG_LEVEL,
    `Model centered at ${center.toArray()} with camera distance ${distance}.`
  );
}

/**
 * @param {Function} onLoaded - Callback called with { mixer, animations, model } after loading
 */
export function loadModel(
  scene,
  camera,
  controls,
  modelPath,
  onLoaded = () => {},
  onProgress = () => {},
  onError = (err) => log('ERROR', err)
) {
  log('DEBUG', FILE_LOG_LEVEL, 'Initializing GLTFLoader...');
  log('INFO', FILE_LOG_LEVEL, `Model loader invoked for: ${modelPath}`);

  // Optional: HEAD check for debugging
  fetch(modelPath, { method: 'HEAD' })
    .then((res) => {
      log('DEBUG', FILE_LOG_LEVEL, `HEAD: ${modelPath} -> status: ${res.status}`);
      log(
        'DEBUG',
        FILE_LOG_LEVEL,
        `Headers: content-type=${res.headers.get('content-type')}, content-length=${res.headers.get(
          'content-length'
        )}`
      );
      if (res.status !== 200) {
        log('ERROR', FILE_LOG_LEVEL, `HEAD request error: Status ${res.status}, URL: ${modelPath}`);
      }
    })
    .catch((e) => {
      log('ERROR', FILE_LOG_LEVEL, `HEAD request failed: ${modelPath}`, e.message || e);
    });

  // Optional: preview first 80 bytes
  fetch(modelPath)
    .then((res) => res.arrayBuffer())
    .then((buf) => {
      const len = buf.byteLength;
      let preview = '';
      try {
        preview = new TextDecoder().decode(buf.slice(0, 80));
      } catch (e) {
        preview = '[binary content]';
      }
      log('DEBUG', FILE_LOG_LEVEL, `Preview (first 80 bytes): ${preview}`);
      log('DEBUG', FILE_LOG_LEVEL, `Model file size: ${len} bytes`);
    })
    .catch((e) => {
      log('ERROR', FILE_LOG_LEVEL, `Model preview fetch failed: ${modelPath}`);
      log('ERROR', FILE_LOG_LEVEL, e.message || e);
    });

  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('/draco/');

  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);
  loader.setMeshoptDecoder(MeshoptDecoder);

  log('DEBUG', FILE_LOG_LEVEL, `User-Agent: ${navigator.userAgent}`);
  log('DEBUG', FILE_LOG_LEVEL, `Timestamp: ${new Date().toISOString()}`);
  log('INFO', FILE_LOG_LEVEL, `Starting to load model from ${modelPath}.`);

  const startTime = performance.now();

  loader.load(
    modelPath,
    (gltf) => {
      const endTime = performance.now();
      const loadTime = ((endTime - startTime) / 1000).toFixed(2);

      const model = gltf.scene;

      if (!model || typeof model !== 'object') {
        const message = '❌ Loaded GLTF scene is null or invalid.';
        log('ERROR', FILE_LOG_LEVEL, message);
        displayLoadError(message);
        onError(new Error(message));
        return;
      }

      model.position.set(0, -1, 0);
      model.scale.set(1.5, 1.5, 1.5);
      scene.add(model);

      let meshCount = 0;
      model.traverse((child) => {
        if (child.isMesh) {
          meshCount++;
          child.material = child.material.clone();
          if (child.material.map) {
            child.material.map = child.material.map.clone();
            child.material.map.needsUpdate = true;
          }
          child.material.needsUpdate = true;
        }
      });

      centerModel(model, camera, controls);
      const mixer = new THREE.AnimationMixer(model);

      const timeBox = document.getElementById('loadingTimeBox');
      if (timeBox) {
        timeBox.textContent = `⏱ Model loaded in ${loadTime}s`;
        timeBox.classList.remove('hidden', 'bg-red-700');
        timeBox.classList.add('bg-black', 'text-white');
      }

      log('INFO', FILE_LOG_LEVEL, 'Model fully loaded and centered.');
      log('DEBUG', FILE_LOG_LEVEL, `Animations loaded: ${gltf.animations.length}`);
      onLoaded({ mixer, animations: gltf.animations, model });
    },

    (xhr) => {
      let percentComplete = 0;
      if (xhr.total && xhr.total > 0) {
        percentComplete = (xhr.loaded / xhr.total) * 100;
        log(
          'DEBUG2',
          FILE_LOG_LEVEL,
          `Loading model: ${percentComplete.toFixed(2)}% complete. (${xhr.loaded}/${xhr.total} bytes)`
        );
      } else {
        log('WARN', 'Progress event missing total size or invalid total:', xhr);
      }
      onProgress(xhr);
    },

    (error) => {
      const message = `❌ Failed to load model: ${error.message || 'Unknown error'}`;
      log('ERROR', FILE_LOG_LEVEL, message);
      log('ERROR', FILE_LOG_LEVEL, error);

      const timeBox = document.getElementById('loadingTimeBox');
      if (timeBox) {
        timeBox.textContent = message;
        timeBox.classList.remove('hidden');
        timeBox.classList.add('bg-red-700', 'text-white');
      }

      if (error && error.target) {
        const { status, responseURL, response } = error.target;
        log('ERROR', FILE_LOG_LEVEL, `Target error → status: ${status}, URL: ${responseURL}`);
        if (response) {
          const preview = String(response).substring(0, 200);
          log('ERROR', FILE_LOG_LEVEL, `Partial response preview: ${preview}`);
        }
      }

      log('ERROR', FILE_LOG_LEVEL, `Stack or object:`, error.stack || error);
      onError(error);
    }
  );
}

function displayLoadError(message) {
  const timeBox = document.getElementById('loading-timebox');
  if (timeBox) {
    timeBox.textContent = message;
    timeBox.classList.remove('hidden');
    timeBox.classList.add('bg-red-700', 'text-white');
  }
}
