// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    open: false,
    allowedHosts: ['localhost', '127.0.0.1', '.ngrok-free.app'],
  },
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
});
