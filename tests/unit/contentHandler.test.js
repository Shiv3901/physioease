import { describe, it, beforeEach, vi, expect } from 'vitest';
import { playAnimationPanel, showContent, setupContentHandlers } from '../../src/components/contentHandler';

vi.mock('../../src/components/uiHelpers.js', () => ({
  updateDebugDimensions: vi.fn(),
}));

vi.mock('../../src/components/animationHandler', () => ({
  playAnimationByName: vi.fn(),
}));

import { playAnimationByName } from '../../src/components/animationHandler';

const createDom = () => {
  document.body.innerHTML = `
    <div id="sharedContentArea" style="display:none;"></div>
    <div id="videoArea"></div>
    <div id="contentArea"></div>
    <div id="modelContainer"></div>
    <div id="moreVideosContainer"></div>
    <div id="animationNameText"></div>
    <div id="animationControlsWrapper" style="display: flex;"></div>
    <button id="closeContentBtn"></button>
    <div id="moreVideosBtn"></div>
    <div id="moreVideosPane"></div>
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
    expect(contentArea.style.display).toBe('flex');
    expect(contentArea.innerHTML).toContain('Hello');
  });

  it('close button resets layout properly', () => {
    setupContentHandlers({});
    document.getElementById('closeContentBtn').click();

    expect(document.getElementById('sharedContentArea').style.display).toBe('none');
    expect(document.getElementById('moreVideosContainer').style.display).toBe('block');
    expect(document.getElementById('contentArea').style.display).toBe('none');
  });

  it('moreVideosBtn toggles metadata buttons', () => {
    const metadata = {
      base_videos: {
        videoA: { title: 'Video A', src: 'a.mp4' },
        category: {
          title: 'Exercises',
          videos: {
            subA: { title: 'Sub A', src: 'subA.mp4' },
          },
        },
      },
    };

    setupContentHandlers(metadata);
    document.getElementById('moreVideosBtn').click();

    const pane = document.getElementById('moreVideosPane');
    expect(pane.style.display).toBe('flex');
    expect(pane.querySelectorAll('.terminal-link').length).toBeGreaterThan(0);
  });

  it('clicking flat video entry plays animation', () => {
    const metadata = {
      base_videos: {
        simple: { src: 'flat.mp4', title: 'Flat Video' },
      },
    };

    setupContentHandlers(metadata);
    document.getElementById('moreVideosBtn').click();

    const flatBtn = document.querySelector('#moreVideosPane .terminal-link');
    expect(flatBtn).toBeTruthy();

    flatBtn.click();
    expect(playAnimationByName).toHaveBeenCalledWith('simple');
  });

  it('clicking sub-video entry plays animation', () => {
    const metadata = {
      base_videos: {
        group: {
          videos: {
            demo: { title: 'Demo', src: 'demo.mp4' },
          },
        },
      },
    };

    setupContentHandlers(metadata);
    document.getElementById('moreVideosBtn').click();

    const subButton = document.querySelector('.sub-menu .terminal-link');
    expect(subButton).toBeTruthy();

    subButton.click();
    expect(playAnimationByName).toHaveBeenCalledWith('demo');
  });

  it('handles small viewport layout', () => {
    window.innerWidth = 500; // simulate mobile
    showContent('<p>mobile view</p>');

    const shared = document.getElementById('sharedContentArea');
    expect(shared.style.position).toBe('absolute');

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
    expect(pane.style.display).toBe('flex');
    expect(pane.style.flexDirection).toBe('column');
    expect(pane.style.gap).toBe('2px');
  });
});
