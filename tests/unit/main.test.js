import { describe, it, vi, beforeEach, expect } from 'vitest';

// Mock the modules that main.js depends on
vi.mock('../../src/homepage.js', () => ({
  loadHomepage: vi.fn(),
}));
vi.mock('../../src/routes/rotatorcuff.js', () => ({
  loadRotatorCuff: vi.fn(),
}));
vi.mock('../../src/routes/ankle.js', () => ({
  loadAnkle: vi.fn(),
}));

describe('main.js routing', () => {
  let loadHomepage, loadRotatorCuff, loadAnkle;

  beforeEach(async () => {
    // Set up a fresh DOM with #app BEFORE importing main.js
    document.body.innerHTML = '<div id="app"></div>';

    // Dynamically import AFTER DOM is ready
    const homepage = await import('../../src/homepage.js');
    const rotator = await import('../../src/routes/rotatorcuff.js');
    const ankle = await import('../../src/routes/ankle.js');

    loadHomepage = homepage.loadHomepage;
    loadRotatorCuff = rotator.loadRotatorCuff;
    loadAnkle = ankle.loadAnkle;

    // Import main.js after the DOM is ready
    await import('../../src/main.js');
  });

  function triggerRoute(pathname) {
    Object.defineProperty(window, 'location', {
      value: { pathname },
      writable: true,
    });

    window.dispatchEvent(new Event('DOMContentLoaded'));
  }

  it('loads homepage on "/"', () => {
    triggerRoute('/');
    expect(loadHomepage).toHaveBeenCalledWith(document.getElementById('app'));
  });

  it('loads homepage on "/index.html"', () => {
    triggerRoute('/index.html');
    expect(loadHomepage).toHaveBeenCalledWith(document.getElementById('app'));
  });

  it('loads rotator cuff route', () => {
    triggerRoute('/rotatorcuff');
    expect(loadRotatorCuff).toHaveBeenCalledWith(document.getElementById('app'));
  });

  it('loads ankle route', () => {
    triggerRoute('/ankle');
    expect(loadAnkle).toHaveBeenCalledWith(document.getElementById('app'));
  });

  it('shows 404 on unknown route', () => {
    document.body.innerHTML = '<div id="app"></div>';

    triggerRoute('/unknown');

    const app = document.getElementById('app');
    expect(app.innerHTML).toContain('404');
  });

  it('pushes pageview to dataLayer', () => {
    triggerRoute('/ankle');
    expect(window.dataLayer).toContainEqual({
      event: 'pageview',
      page_path: '/ankle',
    });
  });
});
