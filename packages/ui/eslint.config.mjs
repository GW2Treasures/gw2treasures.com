import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

const eslintConfig = [
  { ignores: ['components/Table/comparable-properties.ts'] },
  ...compat.extends('next/core-web-vitals', '@gw2treasures/eslint-config/react'),
  { rules: { '@next/next/no-html-link-for-pages': 'off' }}
];

export default eslintConfig;
