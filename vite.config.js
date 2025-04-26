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
});
