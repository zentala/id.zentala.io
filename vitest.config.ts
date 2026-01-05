import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: [
      '.cursor/scripts/**/*.spec.ts',
    ],
    environment: 'node',
    passWithNoTests: false,
    reporters: ['default'],
  },
});



