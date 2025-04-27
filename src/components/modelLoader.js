import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
import { log } from './utils.js';

export function loadModel(scene, camera, controls, onLoaded, onProgress, onError) {
  const loader = new GLTFLoader();
  const modelPath = '/models/rotator-cuff.glb';

  loader.load(
    modelPath,
    (gltf) => {
      const model = gltf.scene;
      model.position.set(0, -1, 0);
      model.scale.set(1.5, 1.5, 1.5);
      scene.add(model);

      model.traverse((child) => {
        if (child.isMesh) {
          child.material = child.material.clone();
          if (child.material.map) {
            child.material.map = child.material.map.clone();
          }
        }
      });

      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const distance =
        Math.max(size.x, size.y, size.z) / (2 * Math.atan((Math.PI * camera.fov) / 360));

      camera.position.copy(center);
      camera.position.z += distance * 1.2;
      camera.position.y += distance * 0.2;
      camera.lookAt(center);
      controls.target.copy(center);
      controls.update();

      onLoaded();
    },
    onProgress,
    onError
  );
}
