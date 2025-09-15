import config from '@gw2treasures/eslint-config';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist/']),
  ...config
]);
