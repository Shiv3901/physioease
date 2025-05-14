import { describe, it, beforeEach, vi, expect } from 'vitest';
import {
  playAnimationPanel,
  showContent,
  setupContentHandlers,
} from '../../src/components/contentHandler';

vi.mock('../../src/components/uiHelpers.js', () => ({
  updateDebugDimensions: vi.fn(),
}));

vi.mock('../../src/components/animationHandler', () => ({
  playAnimationByName: vi.fn(),
}));

import { playAnimationByName } from '../../src/components/animationHandler';

const createDom = () => {
  document.body.innerHTML = `
    <div id="sharedContentArea" class="hidden"></div>
    <div id="videoArea"></div>
    <div id="contentArea" class="hidden"></div>
    <div id="modelContainer"></div>
    <div id="moreVideosContainer" class="hidden"></div>
    <div id="animationNameText"></div>
    <div id="animationControlsWrapper" style="display: flex;"></div>
    <button id="closeContentBtn"></button>
    <div id="moreVideosBtn"></div>
    <div id="moreVideosPane" class="hidden"></div>
  `;
};

describe('contentHandler.js', () => {
  beforeEach(() => {
    createDom();
    vi.clearAllMocks();
  });

  it('playAnimationPanel passes name to animation handler', () => {
    playAnimationPanel('flat.mp4');
    expect(playAnimationByName).toHaveBeenCalledWith('flat.mp4');
  });

  it('showContent sets HTML content and shows content area', () => {
    const html = '<h1>Hello</h1>';
    showContent(html);

    const contentArea = document.getElementById('contentArea');
    expect(contentArea.classList.contains('flex')).toBe(true);
    expect(contentArea.innerHTML).toContain('Hello');
  });

  it('moreVideosBtn toggles metadata buttons', () => {
    const metadata = {
      base_videos: {
        videoA: { title: 'Video A', src: 'a.mp4' },
      },
    };

    setupContentHandlers(metadata);
    document.getElementById('moreVideosBtn').click();

    const pane = document.getElementById('moreVideosPane');
    expect(pane.classList.contains('flex')).toBe(true);
    expect(pane.querySelectorAll('div').length).toBeGreaterThan(0);
  });

  it('clicking flat video entry plays animation', () => {
    const metadata = {
      base_videos: {
        simple: { src: 'flat.mp4', title: 'Flat Video' },
      },
    };

    setupContentHandlers(metadata);
    document.getElementById('moreVideosBtn').click();

    const flatBtn = document.querySelector('#moreVideosPane div');
    expect(flatBtn).toBeTruthy();

    flatBtn.click();
    expect(playAnimationByName).toHaveBeenCalledWith('simple');
  });

  it('handles small viewport layout', () => {
    window.innerWidth = 500; // simulate mobile
    showContent('<p>mobile view</p>');

    const shared = document.getElementById('sharedContentArea');
    expect(shared.classList.contains('absolute')).toBe(true);

    const model = document.getElementById('modelContainer');
    expect(model.style.height).toBe('66.66vh');
  });

  it('applies correct layout styles to moreVideosPane', () => {
    const metadata = {
      base_videos: {
        x: { src: 'x.mp4' },
      },
    };
    setupContentHandlers(metadata);
    document.getElementById('moreVideosBtn').click();

    const pane = document.getElementById('moreVideosPane');
    expect(pane.classList.contains('flex')).toBe(true);
  });
});
