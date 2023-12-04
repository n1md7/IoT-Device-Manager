/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite';
import { envSchema } from './src/common/validations/env.schema';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig(({ mode }) => {
  envSchema.validateSync({ mode }, { strict: true });

  const env = loadEnv(mode, process.cwd());

  return {
    publicDir: 'public',
    envPrefix: 'VITE_',
    outDir: 'dist',
    envDir: process.cwd(),
    server: {
      port: 4096,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: env.VITE_IOT_MANAGER_URL, // Needs to end with "/api"
          changeOrigin: true,
          credentials: 'include',
          timeout: 0,
          proxyTimeout: 0,
          headers: {
            'x-request-id': Math.random().toString(36).substring(7),
          },
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },
    resolve: {
      alias: {
        '@': process.cwd(),
      },
    },
    base: './',
    build: {
      chunkSizeWarningLimit: 700,
      reportCompressedSize: true,
      sourcemap: true,
      assetsDir: '.',
      emptyOutDir: true,
      rollupOptions: {
        input: {
          index: 'index.html',
          about: 'about.html',
        },
      },
    },
    plugins: [solidPlugin()],
    test: {
      setupFiles: ['./tests/unit/__setup__/setup.ts'],
      globals: true,
      environment: 'jsdom',
      coverage: {
        all: true,
        provider: 'v8',
        reporter: ['cobertura', 'text', 'html'],
        exclude: ['*.cjs', '*.config.*', 'dist/**', 'src/**.d.ts', 'tests'],
      },
    },
  };
});
