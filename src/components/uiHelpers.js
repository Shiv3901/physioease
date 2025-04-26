import * as constants from './../constants.js';

export function updateDebugDimensions() {
  const debugDimensions = document.getElementById('debugDimensions');
  if (!debugDimensions) return;

  const { innerWidth: screenW, innerHeight: screenH } = window;

  const modelContainer = document.getElementById('modelContainer');
  const videoArea = document.getElementById('videoArea');

  const { clientWidth: modelW = 0, clientHeight: modelH = 0 } = modelContainer || {};
  const { clientWidth: videoW = 0, clientHeight: videoH = 0 } = videoArea || {};

  const isBottomView = screenW <= constants.MOBILE_BREAKPOINT;
  const layoutType = isBottomView ? 'Column (Mobile)' : 'Row (Desktop)';

  debugDimensions.innerHTML = `
      📱 Screen: ${screenW} × ${screenH}<br>
      🎨 Model: ${modelW} × ${modelH}<br>
      🎬 Video: ${videoW} × ${videoH}<br>
      🧱 Layout: ${layoutType}
    `;
}
