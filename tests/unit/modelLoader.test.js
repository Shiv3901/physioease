import { describe, it, vi, expect, beforeEach } from 'vitest';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { loadModel } from '../../src/components/modelLoader';

// Mock the logging utility
vi.mock('../../src/components/utils', () => ({
  log: vi.fn(),
}));

// Mock the GLTFLoader
vi.mock('three/examples/jsm/loaders/GLTFLoader.js', () => {
  return {
    GLTFLoader: vi.fn().mockImplementation(() => ({
      load: vi.fn(),
      setMeshoptDecoder: vi.fn(), // <--- Important: Add this line
    })),
  };
});

describe('loadModel', () => {
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

    // Check if setMeshoptDecoder was called
    expect(mockLoader.setMeshoptDecoder).toHaveBeenCalled();

    // Check if loader.load was called
    expect(mockLoader.load).toHaveBeenCalled();
    const args = mockLoader.load.mock.calls[0];

    const modelPath = args[0];
    const onSuccess = args[1];

    expect(modelPath).toBe(testModelPath);

    // Simulate successful load
    const dummyScene = new THREE.Group();
    onSuccess({ scene: dummyScene });

    expect(scene.add).toHaveBeenCalledWith(dummyScene);
    expect(onLoaded).toHaveBeenCalled();
  });

  it('calls onProgress during load', () => {
    loadModel(scene, camera, controls, testModelPath, onLoaded, onProgress, onError);

    const args = mockLoader.load.mock.calls[0];
    const onProgressCallback = args[2];

    const xhrMock = { loaded: 50, total: 100 };
    onProgressCallback(xhrMock);

    expect(onProgress).toHaveBeenCalledWith(xhrMock);
  });

  it('calls onError when loading fails', () => {
    loadModel(scene, camera, controls, testModelPath, onLoaded, onProgress, onError);

    const args = mockLoader.load.mock.calls[0];
    const onErrorCallback = args[3];

    const errorMock = new Error('Failed to load');
    onErrorCallback(errorMock);

    expect(onError).toHaveBeenCalledWith(errorMock);
  });
});
