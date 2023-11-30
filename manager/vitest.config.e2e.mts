import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    alias: {
      '/src/*': process.cwd(),
    },
    root: './',
  },
  resolve: {
    alias: {
      '/src/*': process.cwd(),
    },
  },
  plugins: [swc.vite()],
});
