import { loadEnvFile } from 'node:process';
import { defineConfig } from 'vitest/config';

loadEnvFile('.env');

export default defineConfig({
  plugins: [],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: 'node',
  },
});
