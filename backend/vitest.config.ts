import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const backendDirectory = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['frontend-tests/**/*.test.js'],
    coverage: {
      provider: 'v8',
      include: [
        path.resolve(backendDirectory, '../public/js/api-client.js'),
        path.resolve(backendDirectory, '../public/js/auth.js'),
        path.resolve(backendDirectory, '../public/js/avatar.js'),
        path.resolve(backendDirectory, '../public/js/tema.js'),
        path.resolve(backendDirectory, '../public/js/estrelas.js'),
        path.resolve(backendDirectory, '../public/js/loja.js'),
      ],
      allowExternal: true,
      exclude: ['frontend-tests/**'],
      reportsDirectory: 'coverage/frontend',
      reporter: ['text', 'html'],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 90,
        statements: 90,
      },
    },
  },
});
