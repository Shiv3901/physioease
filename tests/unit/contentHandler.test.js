import { describe, it, beforeEach, vi, expect } from 'vitest';
import {
  playAnimationPanel,
  showContent,
  setupContentHandlers,
} from '../../src/components/contentHandler';

vi.mock('../../src/components/animationHandler', () => ({
  playAnimationByName: vi.fn(),
}));

vi.mock('../../src/components/utils.js', () => ({
  log: vi.fn(),
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
    <div id="animationsBtn"></div>
    <div id="animationsPane" class="hidden"></div>
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

  it('animationsBtn toggles metadata buttons', () => {
    const metadata = {
      animations: {
        videoA: { title: 'Video A', src: 'a.mp4' },
      },
    };

    setupContentHandlers(metadata);
    document.getElementById('animationsBtn').click();

    const pane = document.getElementById('animationsPane');
    expect(pane.classList.contains('flex')).toBe(true);
    expect(pane.querySelectorAll('div').length).toBeGreaterThan(0);
  });

  it('clicking flat video entry plays animation', () => {
    const metadata = {
      animations: {
        simple: { src: 'flat.mp4', title: 'Flat Video' },
      },
    };

    setupContentHandlers(metadata);
    document.getElementById('animationsBtn').click();

    const flatBtn = document.querySelector('#animationsPane div');
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

  it('applies correct layout styles to animationsPane', () => {
    const metadata = {
      animations: {
        x: { src: 'x.mp4' },
      },
    };
    setupContentHandlers(metadata);
    document.getElementById('animationsBtn').click();

    const pane = document.getElementById('animationsPane');
    expect(pane.classList.contains('flex')).toBe(true);
  });
});
