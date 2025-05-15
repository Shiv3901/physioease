import { describe, it, vi, expect, beforeEach } from 'vitest';
import * as THREE from 'three';
import { loadModel, centerModel } from '../../src/components/modelLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// ✅ Mock logger
vi.mock('../../src/components/utils.js', () => ({
  log: vi.fn(),
}));

// ✅ Mock DRACO loader
vi.mock('three/examples/jsm/loaders/DRACOLoader.js', () => ({
  DRACOLoader: vi.fn().mockImplementation(() => ({
    setDecoderPath: vi.fn(),
  })),
}));

// ✅ Mock Meshopt decoder
vi.mock('three/examples/jsm/libs/meshopt_decoder.module.js', () => ({
  MeshoptDecoder: {},
}));

// ✅ Spy on real GLTFLoader prototype methods
const mockLoad = vi.spyOn(GLTFLoader.prototype, 'load').mockImplementation((_, onSuccess) => {
  onSuccess({ scene: new THREE.Group(), animations: [] });
});

const mockSetDRACOLoader = vi.spyOn(GLTFLoader.prototype, 'setDRACOLoader');
const mockSetMeshoptDecoder = vi.spyOn(GLTFLoader.prototype, 'setMeshoptDecoder');

describe('modelLoader', () => {
  let scene, camera, controls, onLoaded, onProgress, onError;
  const testModelPath = '/models/testModel.glb';

  beforeEach(() => {
    scene = { add: vi.fn() };
    camera = {
      position: new THREE.Vector3(),
      lookAt: vi.fn(),
      fov: 75,
    };
    controls = {
      target: new THREE.Vector3(),
      update: vi.fn(),
    };
    onLoaded = vi.fn();
    onProgress = vi.fn();
    onError = vi.fn();
  });

  it('loads and adds model to scene', async () => {
    await loadModel(scene, camera, controls, testModelPath, onLoaded, onProgress, onError);

    expect(mockSetMeshoptDecoder).toHaveBeenCalled();
    expect(mockSetDRACOLoader).toHaveBeenCalled();
    expect(mockLoad).toHaveBeenCalled();
    expect(scene.add).toHaveBeenCalled();
    expect(onLoaded).toHaveBeenCalled();
  });

  it('calls onProgress during load', async () => {
    let progressCallback;
    mockLoad.mockImplementation((_, __, onProgressCb) => {
      progressCallback = onProgressCb;
    });

    await loadModel(scene, camera, controls, testModelPath, onLoaded, onProgress, onError);

    const xhrMock = { loaded: 50, total: 100 };
    progressCallback(xhrMock);

    expect(onProgress).toHaveBeenCalledWith(xhrMock);
  });

  it('calls onError when loading fails', async () => {
    let errorCallback;
    mockLoad.mockImplementation((_, __, ___, onErrorCb) => {
      errorCallback = onErrorCb;
    });

    await loadModel(scene, camera, controls, testModelPath, onLoaded, onProgress, onError);

    const errorMock = new Error('Loading failed');
    errorCallback(errorMock);

    expect(onError).toHaveBeenCalledWith(errorMock);
  });

  it('sets model position and scale correctly', async () => {
    let loadedScene;
    mockLoad.mockImplementation((_, onSuccess) => {
      loadedScene = new THREE.Group();
      onSuccess({ scene: loadedScene, animations: [] });
    });

    await loadModel(scene, camera, controls, testModelPath, onLoaded);

    expect(loadedScene.position.y).toBe(-1);
    expect(loadedScene.scale.x).toBe(1.5);
    expect(loadedScene.scale.y).toBe(1.5);
    expect(loadedScene.scale.z).toBe(1.5);
  });

  it('centers model correctly using bounding box', () => {
    const model = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2));
    const testCamera = {
      position: new THREE.Vector3(),
      lookAt: vi.fn(),
      fov: 75,
    };
    const testControls = {
      target: new THREE.Vector3(),
      update: vi.fn(),
    };

    centerModel(model, testCamera, testControls);

    expect(testCamera.lookAt).toHaveBeenCalled();
    expect(testControls.update).toHaveBeenCalled();
    expect(testControls.target.equals(new THREE.Vector3(0, 0, 0))).toBe(true);
  });

  it('handles null GLTF scene gracefully', async () => {
    mockLoad.mockImplementation((_, onSuccess) => {
      onSuccess({ scene: null, animations: [] });
    });

    await loadModel(scene, camera, controls, testModelPath, onLoaded, onProgress, onError);

    expect(onError).toHaveBeenCalledWith(expect.any(Error));
  });
});
