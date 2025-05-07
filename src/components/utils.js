import { LOG_LEVEL } from './config.js';

export function log(level, ...args) {
  const levels = {
    INFO: 0,
    DEBUG: 1,
    DEBUG2: 2,
    WARN: 3,
    ERROR: 4,
  };

  const alwaysLog = level === 'WARN' || level === 'ERROR';

  if (alwaysLog || levels[level] <= levels[LOG_LEVEL]) {
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
