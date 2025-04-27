import { LOG_LEVEL } from '../constants.js';

export function log(level, ...args) {
  const levels = {
    INFO: 0,
    DEBUG: 1,
    DEBUG2: 2,
  };

  if (levels[level] <= levels[LOG_LEVEL]) {
    const color = level === 'INFO' ? 'blue' : level === 'DEBUG' ? 'orange' : 'purple';
    console.log(`%c[${level}]`, `color: ${color}; font-weight: bold;`, ...args);
  }
}
