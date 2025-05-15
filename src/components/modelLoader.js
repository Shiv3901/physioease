import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { log } from './utils.js';

export function centerModel(model, camera, controls) {
  log('DEBUG2', 'Centering model based on bounding box.');

  const box = new THREE.Box3().setFromObject(model);
  log('DEBUG2', `Bounding box min: ${box.min.toArray()}, max: ${box.max.toArray()}`);

  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  log('DEBUG2', `Calculated center: ${center.toArray()}, size: ${size.toArray()}`);

  const distance = Math.max(size.x, size.y, size.z) / (2 * Math.atan((Math.PI * camera.fov) / 360));
  log('DEBUG2', `Calculated camera distance: ${distance}`);

  camera.position.copy(center);
  camera.position.z += distance * 1.2;
  camera.position.y += distance * 0.2;
  camera.lookAt(center);

  log('DEBUG2', `Camera positioned at: ${camera.position.toArray()}`);
  controls.target.copy(center);
  controls.update();

  log('DEBUG2', `Model centered at ${center.toArray()} with camera distance ${distance}.`);
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
  log('DEBUG', 'Initializing GLTFLoader...');
  log('INFO', `Model loader invoked for: ${modelPath}`);

  // Optional: HEAD check for debugging
  fetch(modelPath, { method: 'HEAD' })
    .then((res) => {
      log(
        'DEBUG',
        `HEAD: ${modelPath} -> status: ${res.status}, content-type: ${res.headers.get('content-type')}, size: ${res.headers.get('content-length')}`
      );
      if (res.status !== 200) {
        log('ERROR', `File not found or error: ${modelPath}, status: ${res.status}`);
      }
    })
    .catch((e) => {
      log('ERROR', `HEAD request failed: ${modelPath}`, e);
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
        preview = '[binary]';
      }
      log('DEBUG', `First 80 bytes: ${preview}`);
      log('DEBUG', `Model file length: ${len}`);
    })
    .catch((e) => {
      log('ERROR', `Preview fetch failed: ${modelPath}`, e);
    });

  // ✅ DRACO support
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('/draco/'); // Folder in /public

  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);
  loader.setMeshoptDecoder(MeshoptDecoder);

  log('INFO', `Starting to load model from ${modelPath}.`);

  loader.load(
    modelPath,
    (gltf) => {
      log('DEBUG', 'Model loaded successfully.');
      log('DEBUG', `GLTF content keys: ${Object.keys(gltf)}`);

      const model = gltf.scene;

      if (!model || typeof model !== 'object') {
        log('ERROR', 'Loaded GLTF scene is null or invalid.');
        onError(new Error('Invalid model scene'));
        return;
      }

      log('DEBUG2', 'Model exists and is an object.');
      model.position.set(0, -1, 0);
      model.scale.set(1.5, 1.5, 1.5);
      log(
        'DEBUG2',
        `Model position set to ${model.position.toArray()}, scale set to ${model.scale.toArray()}`
      );

      scene.add(model);
      log('DEBUG2', 'Model added to scene.');

      let meshCount = 0;
      model.traverse((child) => {
        if (child.isMesh) {
          meshCount++;
          log('DEBUG2', `Cloning material for mesh: ${child.name || '[unnamed mesh]'}`);
          child.material = child.material.clone();
          if (child.material.map) {
            log('DEBUG2', `Cloning texture map for mesh: ${child.name || '[unnamed mesh]'}`);
            child.material.map = child.material.map.clone();
            child.material.map.needsUpdate = true;
          }
          child.material.needsUpdate = true;
        }
      });
      log('DEBUG2', `Materials cloned for ${meshCount} mesh(es).`);

      centerModel(model, camera, controls);
      const mixer = new THREE.AnimationMixer(model);

      log('INFO', 'Model fully loaded and centered.');
      log('DEBUG', `Animations loaded: ${gltf.animations.length}`);
      onLoaded({ mixer, animations: gltf.animations, model });
    },

    (xhr) => {
      let percentComplete = 0;
      if (xhr.total && xhr.total > 0) {
        percentComplete = (xhr.loaded / xhr.total) * 100;
        log(
          'DEBUG2',
          `Loading model: ${percentComplete.toFixed(2)}% complete. (${xhr.loaded}/${xhr.total} bytes)`
        );
      } else {
        log('WARN', 'Progress event missing total size or invalid total:', xhr);
      }
      onProgress(xhr);
    },

    (error) => {
      log('ERROR', `Error loading model: ${error.message || error}`);
      log('ERROR', error);
      if (error && error.target) {
        log(
          'ERROR',
          `Error target: status=${error.target.status}, responseURL=${error.target.responseURL}`
        );
        if (error.target.response) {
          log(
            'ERROR',
            `Error response (first 200 chars): ${String(error.target.response).substring(0, 200)}`
          );
        }
      }
      onError(error);
    }
  );
}
