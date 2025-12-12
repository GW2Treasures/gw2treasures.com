import { loadEnvFile } from 'node:process';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

loadEnvFile('.env');

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node',
  },
});
