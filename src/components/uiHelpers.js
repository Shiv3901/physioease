import { MOBILE_BREAKPOINT } from './config.js';
import { log } from './utils.js';

export function updateDebugDimensions() {
  const debugDimensions = document.getElementById('debugDimensions');
  if (!debugDimensions) return void log('DEBUG', 'No debugDimensions found.');

  const { innerWidth: screenW, innerHeight: screenH } = window;

  const modelContainer = document.getElementById('modelContainer');
  const sharedContentArea = document.getElementById('sharedContentArea');

  if (!modelContainer) log('DEBUG', 'No modelContainer.');
  if (!sharedContentArea) log('DEBUG', 'No sharedContentArea.');

  const { clientWidth: modelW = 0, clientHeight: modelH = 0 } = modelContainer || {};
  const { clientWidth: sharedW = 0, clientHeight: sharedH = 0 } = sharedContentArea || {};

  const isBottomView = screenW <= MOBILE_BREAKPOINT;
  const layoutType = isBottomView ? 'Column' : 'Row';

  log(
    'DEBUG2',
    `Screen: ${screenW}x${screenH} | Model: ${modelW}x${modelH} | Shared: ${sharedW}x${sharedH} | Layout: ${layoutType}`
  );

  debugDimensions.innerHTML = `
      📱 Screen: ${screenW} × ${screenH}<br>
      🎨 Model: ${modelW} × ${modelH}<br>
      🎥 Shared: ${sharedW} × ${sharedH}<br>
      🧱 Layout: ${layoutType}
    `;
}
