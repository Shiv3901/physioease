import { MOBILE_BREAKPOINT } from './config.js';
import { log } from './utils.js';

export function updateDebugDimensions() {
  const debugDimensions = document.getElementById('debugDimensions');
  if (!debugDimensions) return void log('DEBUG', 'No debugDimensions found.');

  const { innerWidth: screenW, innerHeight: screenH } = window;

  const modelContainer = document.getElementById('modelContainer');
  const videoArea = document.getElementById('videoArea');

  if (!modelContainer) log('DEBUG', 'No modelContainer.');
  if (!videoArea) log('DEBUG', 'No videoArea.');

  const { clientWidth: modelW = 0, clientHeight: modelH = 0 } = modelContainer || {};
  const { clientWidth: videoW = 0, clientHeight: videoH = 0 } = videoArea || {};

  const isBottomView = screenW <= MOBILE_BREAKPOINT;
  const layoutType = isBottomView ? 'Column' : 'Row';

  log(
    'DEBUG2',
    `Screen: ${screenW}x${screenH} | Model: ${modelW}x${modelH} | Video: ${videoW}x${videoH} | Layout: ${layoutType}`
  );

  debugDimensions.innerHTML = `
      📱 Screen: ${screenW} × ${screenH}<br>
      🎨 Model: ${modelW} × ${modelH}<br>
      🎬 Video: ${videoW} × ${videoH}<br>
      🧱 Layout: ${layoutType}
    `;
}
