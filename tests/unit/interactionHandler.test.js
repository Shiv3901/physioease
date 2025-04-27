import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';
import { InteractionHandler } from '../../src/components/interactionHandlers';
import * as THREE from 'three';

// Mock utils log
vi.mock('../../src/components/utils', () => ({
  log: vi.fn(),
}));

describe('InteractionHandler', () => {
  let scene, camera, canvas, onClickCallback;
  let handler;
  let fakeObject;
  let mockMetadata;

  beforeAll(() => {
    // Create a reusable scene and fake object once
    scene = new THREE.Scene();

    fakeObject = new THREE.Mesh(
      new THREE.BoxGeometry(),
      new THREE.MeshStandardMaterial({
        emissive: new THREE.Color(0x000000), // Ensure emissive exists for highlight
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
      muscle_info: {
        MuscleA: 'Test muscle info',
      },
      specific_videos: {
        MuscleA: {
          normal: 'https://normal.mov',
          rehab: 'https://rehab.mov',
        },
      },
    };

    // Create fresh DOM elements
    const label = document.createElement('div');
    label.id = 'selectedLabel';
    document.body.appendChild(label);

    const popup = document.createElement('div');
    popup.id = 'popup';
    document.body.appendChild(popup);

    const videoLinks = document.createElement('div');
    videoLinks.id = 'videoLinks';
    document.body.appendChild(videoLinks);

    handler = new InteractionHandler(scene, camera, canvas, mockMetadata, onClickCallback);

    // 🔥 Mock raycaster to always hit our fakeObject
    vi.spyOn(handler.raycaster, 'intersectObjects').mockImplementation(() => [
      { object: fakeObject },
    ]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = ''; // Clean DOM
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

  it('updates selected info in the DOM', async () => {
    handler.updateSelectedInfo(fakeObject);

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(document.getElementById('selectedLabel').textContent).toContain('Selected: MuscleA');
    expect(document.getElementById('popup').innerHTML).toContain('Test muscle info');
    expect(document.getElementById('videoLinks').innerHTML).toContain('🎥 Normal Movement');
  });
});
