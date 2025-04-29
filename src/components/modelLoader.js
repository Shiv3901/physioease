import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import * as THREE from 'three';
import { log } from './utils.js';

function centerModel(model, camera, controls) {
  log('DEBUG2', 'Centering model based on bounding box.');

  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const distance = Math.max(size.x, size.y, size.z) / (2 * Math.atan((Math.PI * camera.fov) / 360));

  camera.position.copy(center);
  camera.position.z += distance * 1.2;
  camera.position.y += distance * 0.2;
  camera.lookAt(center);

  controls.target.copy(center);
  controls.update();

  log('DEBUG2', `Model centered at ${center.toArray()} with camera distance ${distance}.`);
}

export function loadModel(
  scene,
  camera,
  controls,
  modelPath,
  onLoaded = () => {},
  onProgress = () => {},
  onError = (err) => log('ERROR', err)
) {
  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);

  log('INFO', `Starting to load model from ${modelPath}.`);

  loader.load(
    modelPath,
    (gltf) => {
      log('DEBUG', 'Model loaded successfully.');

      const model = gltf.scene;
      model.position.set(0, -1, 0);
      model.scale.set(1.5, 1.5, 1.5);
      scene.add(model);

      log('DEBUG2', 'Model added to scene. Starting to clone materials.');

      model.traverse((child) => {
        if (child.isMesh) {
          child.material = child.material.clone();
          if (child.material.map) {
            child.material.map = child.material.map.clone();
            child.material.map.needsUpdate = true;
          }
          child.material.needsUpdate = true;
        }
      });

      log('DEBUG2', 'Materials cloned successfully.');

      centerModel(model, camera, controls);

      log('INFO', 'Model fully loaded and centered.');
      onLoaded();
    },
    (xhr) => {
      const percentComplete = (xhr.loaded / xhr.total) * 100;
      log('DEBUG2', `Loading model: ${percentComplete.toFixed(2)}% complete.`);
      onProgress(xhr);
    },
    (error) => {
      log('ERROR', `Error loading model: ${error.message}`);
      onError(error);
    }
  );
}
