import { describe, it, beforeEach, expect, vi } from 'vitest';

vi.mock('../../src/components/utils.js', () => {
  const logMock = vi.fn();
  return {
    log: logMock,
    __esModule: true,
    get logMock() {
      return logMock;
    },
  };
});

import { updateDebugDimensions } from '../../src/components/uiHelpers';
import { MOBILE_BREAKPOINT } from '../../src/components/config';
import * as utils from '../../src/components/utils';

describe('uiHelpers.js > updateDebugDimensions', () => {
  beforeEach(() => {
    utils.logMock.mockClear();

    document.body.innerHTML = `
      <div id="debugDimensions"></div>
      <div id="modelContainer"></div>
      <div id="sharedContentArea"></div>
    `;

    const model = document.getElementById('modelContainer');
    Object.defineProperties(model, {
      clientWidth: { value: 300 },
      clientHeight: { value: 400 },
    });

    const shared = document.getElementById('sharedContentArea');
    Object.defineProperties(shared, {
      clientWidth: { value: 200 },
      clientHeight: { value: 100 },
    });

    global.innerWidth = 1200;
    global.innerHeight = 800;
  });

  it('updates debugDimensions content in desktop (row) layout', () => {
    updateDebugDimensions();
    const html = document.getElementById('debugDimensions').innerHTML;
    expect(html).toContain('📱 Screen: 1200 × 800');
    expect(html).toContain('🎨 Model: 300 × 400');
    expect(html).toContain('🎥 Shared: 200 × 100');
    expect(html).toContain('🧱 Layout: Row');
  });

  it('uses "Column" layout on mobile', () => {
    global.innerWidth = MOBILE_BREAKPOINT - 1;
    updateDebugDimensions();
    expect(document.getElementById('debugDimensions').innerHTML).toContain('🧱 Layout: Column');
  });

  it('logs if debugDimensions is missing', () => {
    document.getElementById('debugDimensions').remove();
    updateDebugDimensions();
    expect(utils.logMock).toHaveBeenCalledWith('DEBUG', 'No debugDimensions found.');
  });

  it('logs if modelContainer or sharedContentArea are missing', () => {
    document.getElementById('modelContainer').remove();
    document.getElementById('sharedContentArea').remove();
    updateDebugDimensions();
    expect(utils.logMock).toHaveBeenCalledWith('DEBUG', 'No modelContainer.');
    expect(utils.logMock).toHaveBeenCalledWith('DEBUG', 'No sharedContentArea.');
  });
});
