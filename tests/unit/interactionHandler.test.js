import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';
import { loadHTMLContent, InteractionHandler } from '../../src/components/interactionHandlers';
import * as THREE from 'three';
import { IMAGE_BASE_URL } from '../../src/components/config';

vi.mock('../../src/components/utils', () => ({
  log: vi.fn(),
}));

describe('InteractionHandler', () => {
  let scene, camera, canvas, onClickCallback, playAnimationPanel, showContentCallback;
  let handler, fakeObject, mockMetadata;

  beforeAll(() => {
    scene = new THREE.Scene();
    fakeObject = new THREE.Mesh(
      new THREE.BoxGeometry(),
      new THREE.MeshStandardMaterial({ emissive: new THREE.Color(0x000000) })
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
    playAnimationPanel = vi.fn();
    showContentCallback = vi.fn();

    mockMetadata = {
      specific_videos: {
        MuscleA: {
          info: 'Test muscle info',
          normal: { title: '🎥 Normal Movement', src: 'https://normal.mov', type: 'video' },
          rehab: { title: '🛠️ Rehab Exercises', src: 'https://rehab.mov', type: 'video' },
        },
      },
    };

    document.body.innerHTML = `
      <div id="selectedLabel"></div>
      <div id="popup"></div>
      <div id="videoLinks"></div>
    `;

    handler = new InteractionHandler(
      scene,
      camera,
      canvas,
      mockMetadata,
      onClickCallback,
      playAnimationPanel,
      showContentCallback
    );

    vi.spyOn(handler.raycaster, 'intersectObjects').mockImplementation(() => [
      { object: fakeObject },
    ]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('initializes with correct event listeners', () => {
    const spy = vi.spyOn(window, 'addEventListener');
    new InteractionHandler(scene, camera, canvas, mockMetadata, onClickCallback);
    ['pointermove', 'pointerdown', 'pointerup', 'pointercancel', 'pointerleave'].forEach((event) =>
      expect(spy).toHaveBeenCalledWith(event, expect.any(Function))
    );
    spy.mockRestore();
  });

  it('updates mouse position', () => {
    handler.onPointerMove({ clientX: 50, clientY: 50 });
    expect(handler.mouse.x).toBeCloseTo(0);
    expect(handler.mouse.y).toBeCloseTo(0);
  });

  it('handles object selection toggle', () => {
    handler.currentHovered = fakeObject;
    handler.onPointerUp({});
    expect(handler.currentClicked).toBe(fakeObject);
    expect(onClickCallback).toHaveBeenCalledWith(fakeObject);
    handler.onPointerUp({});
    expect(handler.currentClicked).toBe(null);
    expect(document.getElementById('selectedLabel').textContent).toContain('None');
  });

  it('detects long press', () => {
    vi.useFakeTimers();
    handler.onPointerDown();
    vi.advanceTimersByTime(500);
    expect(handler.isLongPress).toBe(true);
    vi.useRealTimers();
  });

  it('clears long press hold correctly', () => {
    vi.useFakeTimers();
    handler.onPointerDown();
    handler.clearHold();
    vi.advanceTimersByTime(500);
    expect(handler.isLongPress).toBe(false);
    vi.useRealTimers();
  });

  it('handles highlight setting and restoring', () => {
    handler.setHighlight(fakeObject, 'hover');
    expect(fakeObject.material.emissive.getHex()).toBe(0x999900);
    handler.setHighlight(fakeObject, 'click');
    expect(fakeObject.material.emissive.getHex()).toBe(0x009900);
    handler.setHighlight(fakeObject, 'restore');
    expect(fakeObject.material.emissive.getHex()).toBe(0x000000);
  });

  it('safely handles missing material or emissive in highlight', () => {
    expect(() => handler.setHighlight({}, 'hover')).not.toThrow();
    expect(() => handler.setHighlight({ material: {} }, 'click')).not.toThrow();
    expect(() => handler.setHighlight(null, 'hover')).not.toThrow();
  });

  it('clears highlight if no intersection', () => {
    handler.currentHovered = fakeObject;
    handler.raycaster.intersectObjects.mockReturnValue([]);
    handler.update();
    expect(handler.currentHovered).toBe(null);
    expect(fakeObject.material.emissive.getHex()).toBe(0x000000);
  });

  it('displays selected object info', () => {
    handler.updateSelectedInfo(fakeObject);
    expect(document.getElementById('selectedLabel').textContent).toContain('🧠 Selected:');
  });

  it('does not create content button if path is missing', () => {
    const badMetadata = {
      specific_videos: {
        MuscleA: {
          info: 'Some info',
          article: { title: 'Broken Content', type: 'content' },
        },
      },
    };
    handler = new InteractionHandler(scene, camera, canvas, badMetadata, onClickCallback);
    handler.updateSelectedInfo(fakeObject);
    expect(document.querySelectorAll('.terminal-link').length).toBe(0);
  });

  describe('updateSelectedInfo()', () => {
    it('clears UI for null input', () => {
      handler.updateSelectedInfo(null);
      expect(document.getElementById('selectedLabel').textContent).toContain('None');
      expect(document.getElementById('popup').style.display).toBe('none');
      expect(document.getElementById('videoLinks').style.display).toBe('none');
    });

    it('handles unknown object name', () => {
      const unknown = new THREE.Mesh();
      unknown.name = 'Unknown';
      handler.updateSelectedInfo(unknown);
      expect(document.getElementById('selectedLabel').textContent).toContain('Unknown');
      expect(document.getElementById('popup').textContent).toContain('No description');
    });

    it('hides video links if no video buttons exist', () => {
      const noVideoMetadata = { specific_videos: { MuscleA: { info: 'Only info' } } };
      handler = new InteractionHandler(scene, camera, canvas, noVideoMetadata, onClickCallback);
      handler.updateSelectedInfo(fakeObject);
      expect(document.getElementById('videoLinks').style.display).toBe('none');
    });

    it('logs warning for bad fetch response', async () => {
      global.fetch = vi.fn(() => Promise.resolve({ ok: false }));
      const { log } = await import('../../src/components/utils');
      const result = await loadHTMLContent('/bad.html');
      expect(log).toHaveBeenCalledWith(
        'WARN',
        expect.stringContaining('[loadHTMLContent] Failed to load')
      );
      expect(result).toBe('');
    });

    it('logs error if fetch throws', async () => {
      global.fetch = vi.fn(() => Promise.reject(new Error('network fail')));
      const { log } = await import('../../src/components/utils');
      const result = await loadHTMLContent('/broken');
      expect(log).toHaveBeenCalledWith('ERROR', expect.stringContaining('network fail'));
      expect(result).toBe('');
    });

    it('loads and shows HTML content for content entry', async () => {
      const mockHTML = '<div>%IMAGE_BASE%</div>';
      global.fetch = vi.fn(() =>
        Promise.resolve({ ok: true, text: () => Promise.resolve(mockHTML) })
      );
      const metadata = {
        specific_videos: {
          MuscleA: {
            info: 'Some info',
            article: { title: '🧾 Article Link', type: 'content', path: '/mock-content.html' },
          },
        },
      };
      handler = new InteractionHandler(
        scene,
        camera,
        canvas,
        metadata,
        onClickCallback,
        playAnimationPanel,
        showContentCallback
      );
      handler.updateSelectedInfo(fakeObject);
      document.querySelector('.terminal-link').click();
      await new Promise((r) => setTimeout(r, 10));
      expect(showContentCallback).toHaveBeenCalledWith('<div>' + IMAGE_BASE_URL + '</div>');
    });

    it('loads HTML and calls showContentCallback', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({ ok: true, text: () => Promise.resolve('<div>HTML</div>') })
      );
      const metadata = {
        specific_videos: {
          MuscleA: {
            info: 'Info',
            article: { title: '📄 Read More', type: 'content', path: '/mock.html' },
          },
        },
      };
      handler = new InteractionHandler(
        scene,
        camera,
        canvas,
        metadata,
        onClickCallback,
        playAnimationPanel,
        showContentCallback
      );
      handler.updateSelectedInfo(fakeObject);
      document.querySelector('.terminal-link').click();
      await new Promise((r) => setTimeout(r, 50));
      expect(showContentCallback).toHaveBeenCalledWith(expect.stringContaining('<div>HTML</div>'));
    });

    it('replaces %IMAGE_BASE% and shows content', async () => {
      const mockHTML = '<div>%IMAGE_BASE%</div>';
      global.fetch = vi.fn(() =>
        Promise.resolve({ ok: true, text: () => Promise.resolve(mockHTML) })
      );
      const metadata = {
        specific_videos: {
          MuscleA: {
            info: 'Info',
            article: { title: 'Read Article', type: 'content', path: '/mock-article.html' },
          },
        },
      };
      handler = new InteractionHandler(
        scene,
        camera,
        canvas,
        metadata,
        onClickCallback,
        playAnimationPanel,
        showContentCallback
      );
      handler.updateSelectedInfo(fakeObject);
      document.querySelector('.terminal-link').click();
      await new Promise((r) => setTimeout(r, 10));
      expect(showContentCallback).toHaveBeenCalledWith('<div>' + IMAGE_BASE_URL + '</div>');
    });
  });
});
