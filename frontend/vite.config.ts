import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  publicDir: 'public',
  server: {
    host: 'localhost',
    port: 4096,
    strictPort: true,
    open: false,
    // proxy: {
    //   '/api': {
    //     target: 'http://127.0.0.1:3001',
    //     changeOrigin: true,
    //     secure: false
    //   }
    // }
  },
});
