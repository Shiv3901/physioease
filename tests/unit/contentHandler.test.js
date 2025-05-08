import { describe, it, beforeEach, vi, expect } from 'vitest';
import { playVideo, showContent, setupContentHandlers } from '../../src/components/contentHandler';

beforeAll(() => {
  HTMLMediaElement.prototype.load = vi.fn();
});

vi.mock('../../src/components/uiHelpers.js', () => ({
  updateDebugDimensions: vi.fn(),
}));

const createDom = () => {
  document.body.innerHTML = `
    <div id="sharedContentArea" style="display:none;"></div>
    <div id="videoArea"></div>
    <div id="contentArea"></div>
    <div id="modelContainer"></div>
    <div id="moreVideosContainer"></div>
    <video id="exerciseVideo"><source /></video>
    <button id="closeContentBtn"></button>
    <div id="moreVideosBtn"></div>
    <div id="moreVideosPane"></div>
  `;
};

describe('contentHandler.js', () => {
  beforeEach(() => {
    createDom();
  });

  it('playVideo sets video source and shows video area', () => {
    const source = document.querySelector('#exerciseVideo source');
    const loadSpy = vi.spyOn(document.getElementById('exerciseVideo'), 'load');

    playVideo('video.mp4');

    expect(source.src).toContain('video.mp4');
    expect(document.getElementById('videoArea').style.display).toBe('flex');
    expect(document.getElementById('contentArea').style.display).toBe('none');
    expect(document.getElementById('sharedContentArea').style.display).toBe('flex');
    expect(loadSpy).toHaveBeenCalled();
  });

  it('showContent sets HTML content and shows content area', () => {
    const html = '<h1>Hello</h1>';
    showContent(html);

    const contentArea = document.getElementById('contentArea');
    expect(contentArea.style.display).toBe('flex');
    expect(contentArea.innerHTML).toContain('Hello');
  });

  it('close button resets layout and clears video', () => {
    const video = document.getElementById('exerciseVideo');
    const source = video.querySelector('source');

    video.currentTime = 10;
    video.pause = vi.fn();
    source.src = 'some.mp4';

    setupContentHandlers({});
    document.getElementById('closeContentBtn').click();

    expect(video.pause).toHaveBeenCalled();
    expect(video.currentTime).toBe(0);
    expect(source.getAttribute('src')).toBe('');
    expect(document.getElementById('sharedContentArea').style.display).toBe('none');
    expect(document.getElementById('moreVideosContainer').style.display).toBe('block');
  });

  it('moreVideosBtn toggles video buttons based on metadata', () => {
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

  it('clicking sub-video plays correct src', () => {
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
    subButton.click();

    const source = document.querySelector('#exerciseVideo source');
    expect(source.src).toContain('demo.mp4');
  });

  it('handles small viewport (bottom view layout)', () => {
    window.innerWidth = 500; // simulate mobile
    showContent('<p>mobile view</p>');

    const shared = document.getElementById('sharedContentArea');
    expect(shared.style.position).toBe('absolute');

    const model = document.getElementById('modelContainer');
    expect(model.style.height).toBe('66.66vh');
  });

  it('falls back when video elements are missing', () => {
    document.getElementById('exerciseVideo').remove(); // remove the video

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    playVideo('some.mp4');
    expect(warnSpy).toHaveBeenCalledWith('Video elements not found.');
  });

  it('handles flat video entry with src', () => {
    const metadata = {
      base_videos: {
        simple: { src: 'flat.mp4', title: 'Flat Video' },
      },
    };

    setupContentHandlers(metadata);
    document.getElementById('moreVideosBtn').click();

    const btn = document.querySelector('#moreVideosPane .terminal-link');
    expect(btn).toBeTruthy();

    btn.click();
    expect(document.querySelector('#exerciseVideo source').src).toContain('flat.mp4');
  });

  it('styles moreVideosPane correctly when expanded', () => {
    const metadata = {
      base_videos: {
        x: { src: 'a.mp4' },
      },
    };

    setupContentHandlers(metadata);
    document.getElementById('moreVideosBtn').click();

    const pane = document.getElementById('moreVideosPane');
    expect(pane.style.display).toBe('flex');
    expect(pane.style.flexDirection).toBe('column');
    expect(pane.style.gap).toBe('2px');
  });

  it('calls load() and sets muted when playing video', () => {
    const video = document.getElementById('exerciseVideo');
    video.load = vi.fn(); // mock load method

    playVideo('x.mp4');

    expect(video.load).toHaveBeenCalled();
    expect(video.muted).toBe(true);
  });

  it('clicking flat video entry plays video', () => {
    const metadata = {
      base_videos: {
        simple: { src: 'flat.mp4', title: 'Flat One' },
      },
    };

    setupContentHandlers(metadata);
    document.getElementById('moreVideosBtn').click();

    const flatBtn = document.querySelector('#moreVideosPane .terminal-link');
    expect(flatBtn).toBeTruthy();

    flatBtn.click();
    expect(document.querySelector('#exerciseVideo source').src).toContain('flat.mp4');
  });

  it('applies correct layout styles to moreVideosPane', () => {
    const metadata = {
      base_videos: {
        v: { src: 'v.mp4' },
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
