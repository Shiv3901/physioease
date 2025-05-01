import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';
import { InteractionHandler } from '../../src/components/interactionHandlers';
import * as THREE from 'three';

// Mock logger
vi.mock('../../src/components/utils', () => ({
  log: vi.fn(),
}));

describe('InteractionHandler', () => {
  let scene, camera, canvas, onClickCallback;
  let handler;
  let fakeObject;
  let mockMetadata;

  beforeAll(() => {
    scene = new THREE.Scene();

    fakeObject = new THREE.Mesh(
      new THREE.BoxGeometry(),
      new THREE.MeshStandardMaterial({
        emissive: new THREE.Color(0x000000), // Needed for highlighting
      })
    );
    fakeObject.name = 'MuscleA';
    scene.add(fakeObject);
  });

  beforeEach(() => {
    camera = new THREE.PerspectiveCamera();
    canvas = {
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 100, height: 100 }),
      addEventListener: vi.fn(),
    };
    onClickCallback = vi.fn();

    mockMetadata = {
      specific_videos: {
        MuscleA: {
          info: 'Test muscle info',
          normal: { title: '🎥 Normal Movement', src: 'https://normal.mov' },
          rehab: { title: '🛠️ Rehab Exercises', src: 'https://rehab.mov' },
        },
      },
    };

    // Set up required DOM
    document.body.innerHTML = `
      <div id="selectedLabel"></div>
      <div id="popup"></div>
      <div id="videoLinks"></div>
    `;

    handler = new InteractionHandler(scene, camera, canvas, mockMetadata, onClickCallback);

    // Force raycaster to hit our object
    vi.spyOn(handler.raycaster, 'intersectObjects').mockImplementation(() => [
      { object: fakeObject },
    ]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('initializes correctly', () => {
    expect(handler.scene).toBe(scene);
    expect(handler.camera).toBe(camera);
    expect(handler.canvas).toBe(canvas);
    expect(handler.raycaster).toBeInstanceOf(THREE.Raycaster);
  });

  it('updates mouse position on pointer move', () => {
    const fakeEvent = { clientX: 50, clientY: 50 };
    handler.onPointerMove(fakeEvent);

    expect(handler.mouse.x).toBeCloseTo(0);
    expect(handler.mouse.y).toBeCloseTo(0);
  });

  it('detects and handles click on hovered object', () => {
    handler.currentHovered = fakeObject;
    handler.onPointerUp({});

    expect(handler.currentClicked).toBe(fakeObject);
    expect(onClickCallback).toHaveBeenCalledWith(fakeObject);
  });

  it('highlights hovered object', () => {
    handler.currentClicked = null;
    handler.mouse.x = 0;
    handler.mouse.y = 0;

    handler.update();

    expect(handler.currentHovered).toBe(fakeObject);
  });

  it('detects long press', async () => {
    vi.useFakeTimers();

    handler.onPointerDown({});
    vi.advanceTimersByTime(500);

    expect(handler.isLongPress).toBe(true);

    vi.useRealTimers();
  });
});
