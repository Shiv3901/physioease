import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: './',
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    open: false,
    allowedHosts: ['localhost', '127.0.0.1', '.ngrok-free.app'],
  },
  plugins: [tailwindcss()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            const parts = id.toString().split('node_modules/')[1].split('/');
            return parts[0];
          }
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    threads: false,
    isolate: false,
    watch: true,
    deps: {
      optimizer: {
        web: {
          include: ['src'],
          exclude: ['three'],
        },
      },
    },
    coverage: {
      reporter: ['text', 'html'],
      enabled: true,
    },
  },
});
