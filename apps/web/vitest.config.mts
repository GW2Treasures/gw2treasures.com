import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { playwright } from '@vitest/browser-playwright';

 
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    setupFiles: [
      './lib/next.mock.ts'
    ],
    include: ['**/*.test.{ts,tsx}'],
    browser: {
      enabled: true,
      provider: playwright(),
      // https://vitest.dev/config/browser/playwright
      instances: [
        { browser: 'chromium' },
      ]
    },
  },
  define: {
    'process.env': {}
  },
});
