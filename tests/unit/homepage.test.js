import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadHomepage } from '../../src/homepage.js';

describe('loadHomepage', () => {
  let app;

  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    app = document.getElementById('app');
    document.head.innerHTML = '';
  });

  it('renders PhysioEase content into the app element', () => {
    loadHomepage(app);
    expect(app.innerHTML).toContain('PhysioEase v');
    expect(app.querySelector('#launch-rotator')).toBeTruthy();
    expect(app.querySelector('#launch-ankle')).toBeTruthy();
    expect(app.querySelector('.pe-btn')).toBeTruthy();
  });

  it('does NOT inject legacy terminal-box style tag', () => {
    loadHomepage(app);
    const styles = [...document.head.querySelectorAll('style')];
    // Expect no injected terminal-box styles anymore
    const hasTerminalStyles = styles.some((style) => style.innerHTML.includes('.terminal-box'));
    expect(hasTerminalStyles).toBe(false);
  });

  it('clicking "Rotator Cuff Viewer" triggers history.pushState and popstate', () => {
    const pushStateSpy = vi.spyOn(history, 'pushState');
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

    loadHomepage(app);

    const rotatorLink = document.getElementById('launch-rotator');
    rotatorLink.click();

    expect(pushStateSpy).toHaveBeenCalledWith({}, '', '/rotatorcuff');
    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Event));
    expect(dispatchSpy.mock.calls[0][0].type).toBe('popstate');
  });

  it('clicking "Ankle Viewer" triggers history.pushState and popstate', () => {
    const pushStateSpy = vi.spyOn(history, 'pushState');
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

    loadHomepage(app);

    const ankleLink = document.getElementById('launch-ankle');
    ankleLink.click();

    expect(pushStateSpy).toHaveBeenCalledWith({}, '', '/ankle');
    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Event));
    expect(dispatchSpy.mock.calls[0][0].type).toBe('popstate');
  });
});
