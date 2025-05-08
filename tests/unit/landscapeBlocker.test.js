import { describe, it, beforeEach, vi, expect } from 'vitest';
import { mountLandscapeBlocker } from '../../src/components/landscapeBlocker';

describe('landscapeBlocker.js', () => {
  let reloadMock;

  beforeEach(() => {
    document.body.innerHTML = '';
    reloadMock = vi.fn();

    vi.stubGlobal('matchMedia', (query) => {
      return {
        matches: query.includes('landscape'),
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        onchange: null,
        dispatchEvent: vi.fn(),
      };
    });

    const loc = window.location;
    delete window.location;
    window.location = { ...loc, reload: reloadMock };
  });

  it('creates the landscapeWarning element', () => {
    mountLandscapeBlocker();
    const warning = document.getElementById('landscapeWarning');
    expect(warning).toBeTruthy();
    expect(warning.style.display).toBe('none');
  });

  it('shows warning in landscape mode on mobile', () => {
    window.innerWidth = 500;
    mountLandscapeBlocker();
    const warning = document.getElementById('landscapeWarning');
    expect(warning.style.display).toBe('flex');
  });

  it('hides warning in portrait or wide mode', () => {
    vi.stubGlobal('matchMedia', () => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    window.innerWidth = 500;
    mountLandscapeBlocker();
    const warning = document.getElementById('landscapeWarning');
    expect(warning.style.display).toBe('none');
  });

  it('reloads the page after exiting landscape', () => {
    let isLandscape = true;

    vi.stubGlobal('matchMedia', () => ({
      matches: isLandscape,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    window.innerWidth = 500;
    mountLandscapeBlocker();

    isLandscape = false;
    window.dispatchEvent(new Event('resize'));

    expect(window.location.reload).toHaveBeenCalled();
  });
});
