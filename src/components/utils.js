import { LOG_LEVEL, DEBUG_MODE } from './config.js';

export function log(level, ...args) {
  const baseLevels = {
    INFO: 0,
    WARN: 1,
    ERROR: 2,
  };

  const debugLevels = {
    INFO: 0,
    DEBUG: 1,
    DEBUG2: 2,
    WARN: 3,
    ERROR: 4,
  };

  const levels = DEBUG_MODE ? debugLevels : baseLevels;

  const alwaysLog = level === 'WARN' || level === 'ERROR';

  if (levels[level] !== undefined && (alwaysLog || levels[level] <= levels[LOG_LEVEL])) {
    let color;
    switch (level) {
      case 'INFO':
        color = 'blue';
        break;
      case 'DEBUG':
        color = 'orange';
        break;
      case 'DEBUG2':
        color = 'purple';
        break;
      case 'WARN':
        color = 'goldenrod';
        break;
      case 'ERROR':
        color = 'red';
        break;
      default:
        color = 'black';
    }

    console.log(`%c[${level}]`, `color: ${color}; font-weight: bold;`, ...args);
  }
}

export function injectViewerHeadAssets() {
  // Inject viewer.css if not already present
  const styleId = 'viewer-css-link';
  if (!document.getElementById(styleId)) {
    const link = document.createElement('link');
    link.id = styleId;
    link.rel = 'stylesheet';
    link.href = '/src/styles/viewer.css';
    document.head.appendChild(link);
  }

  // Inject viewport meta tag if not already present
  const viewportId = 'viewer-viewport-meta';
  if (!document.getElementById(viewportId)) {
    const meta = document.createElement('meta');
    meta.id = viewportId;
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0';
    document.head.appendChild(meta);
  }
}
