import { describe, it, vi, beforeEach, expect } from 'vitest';

vi.mock('../../src/homepage.js', () => ({
  loadHomepage: vi.fn(),
}));

vi.mock('../../src/routes/library.js', () => ({
  loadLibrary: vi.fn(),
}));

vi.mock('../../src/templates/codeTemplate.js', () => ({
  loadModelByKey: vi.fn(),
}));

vi.mock('../../src/components/config.js', () => ({
  METADATA_MAP: {
    ankle: { mock: true },
    rotatorcuff: { mock: true },
    lowerback: { mock: true },
  },
  LOG_LEVEL: 'DEBUG',
  DEBUG_MODE: true,
}));

describe('main.js routing (refactored)', () => {
  let loadHomepage, loadLibrary, loadModelByKey;

  beforeEach(async () => {
    document.body.innerHTML = '<div id="app"></div>';
    window.dataLayer = [];

    const homepage = await import('../../src/homepage.js');
    const library = await import('../../src/routes/library.js');
    const template = await import('../../src/templates/codeTemplate.js');

    loadHomepage = homepage.loadHomepage;
    loadLibrary = library.loadLibrary;
    loadModelByKey = template.loadModelByKey;

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

  it('loads model route for /rotatorcuff', () => {
    triggerRoute('/rotatorcuff');
    expect(loadModelByKey).toHaveBeenCalledWith(
      document.getElementById('app'),
      'rotatorcuff',
      expect.any(Object)
    );
  });

  it('loads model route for /ankle', () => {
    triggerRoute('/ankle');
    expect(loadModelByKey).toHaveBeenCalledWith(
      document.getElementById('app'),
      'ankle',
      expect.any(Object)
    );
  });

  it('loads model route for /lowerback', () => {
    triggerRoute('/lowerback');
    expect(loadModelByKey).toHaveBeenCalledWith(
      document.getElementById('app'),
      'lowerback',
      expect.any(Object)
    );
  });

  it('loads library route', () => {
    triggerRoute('/library');
    expect(loadLibrary).toHaveBeenCalledWith(document.getElementById('app'));
  });

  it('renders 404 page on unknown route', () => {
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
