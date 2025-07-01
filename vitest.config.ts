import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    watch: false,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: 'tests/results',
      include: ['src/**/*.ts'],
      exclude: ['node_modules/', 'tests/', 'src/index.ts'],
    },
    include: ['**/*.{test,spec}.{ts,tsx}'],
    typecheck: {
      enabled: true,
      include: ['**/*.{test-d,spec-d}.{ts,tsx}'],
    },
  },
});
