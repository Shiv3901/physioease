import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom', // <- this enables document/window support
    setupFiles: ['./tests/vitest.setup.js'], // if needed
  },
});
