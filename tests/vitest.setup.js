import { LOG_LEVEL } from '../src/components/config';

// tests/vitest.setup.js
vi.mock('../src/components/config.js', () => ({
  LOG_LEVEL: 'DEBUG',
  DEBUG_MODE: true,
}));
