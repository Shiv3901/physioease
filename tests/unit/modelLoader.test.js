import { describe, it, vi, expect, beforeEach } from 'vitest';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { loadModel, centerModel } from '../../src/components/modelLoader';

// Mock the logging utility
vi.mock('../../src/components/utils', () => ({
  log: vi.fn(),
}));

// Mock the GLTFLoader
vi.mock('three/examples/jsm/loaders/GLTFLoader.js', () => {
  return {
    GLTFLoader: vi.fn().mockImplementation(() => ({
      load: vi.fn(),
      setMeshoptDecoder: vi.fn(),
    })),
  };
});

describe('modelLoader', () => {
  let scene, camera, controls, onLoaded, onProgress, onError;
  let mockLoader;
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

    mockLoader = new GLTFLoader();
    mockLoader.load = vi.fn();
    GLTFLoader.mockImplementation(() => mockLoader);
  });

  it('loads and adds model to scene', () => {
    loadModel(scene, camera, controls, testModelPath, onLoaded, onProgress, onError);

    expect(mockLoader.setMeshoptDecoder).toHaveBeenCalled();
    expect(mockLoader.load).toHaveBeenCalled();

    const args = mockLoader.load.mock.calls[0];
    const modelPath = args[0];
    const onSuccess = args[1];

    expect(modelPath).toBe(testModelPath);

    const dummyScene = new THREE.Group();
    onSuccess({ scene: dummyScene });

    expect(scene.add).toHaveBeenCalledWith(dummyScene);
    expect(onLoaded).toHaveBeenCalled();
  });

  it('calls onProgress during load', () => {
    loadModel(scene, camera, controls, testModelPath, onLoaded, onProgress, onError);

    const onProgressCallback = mockLoader.load.mock.calls[0][2];
    const xhrMock = { loaded: 50, total: 100 };
    onProgressCallback(xhrMock);

    expect(onProgress).toHaveBeenCalledWith(xhrMock);
  });

  it('calls onError when loading fails', () => {
    loadModel(scene, camera, controls, testModelPath, onLoaded, onProgress, onError);

    const onErrorCallback = mockLoader.load.mock.calls[0][3];
    const errorMock = new Error('Failed to load');
    onErrorCallback(errorMock);

    expect(onError).toHaveBeenCalledWith(errorMock);
  });

  it('sets model position and scale correctly', () => {
    const dummyScene = new THREE.Group();
    mockLoader.load.mockImplementation((_, onSuccess) => {
      onSuccess({ scene: dummyScene });
    });

    loadModel(scene, camera, controls, testModelPath, onLoaded);
    expect(dummyScene.position.y).toBe(-1);
    expect(dummyScene.scale.x).toBe(1.5);
    expect(dummyScene.scale.y).toBe(1.5);
    expect(dummyScene.scale.z).toBe(1.5);
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

  it('handles null GLTF scene gracefully', () => {
    mockLoader.load.mockImplementation((_, onSuccess) => {
      onSuccess({ scene: null });
    });

    loadModel(scene, camera, controls, testModelPath, onLoaded, onProgress, onError);

    expect(onError).toHaveBeenCalledWith(expect.any(Error));
  });
});
