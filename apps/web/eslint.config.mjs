import nextJsPlugin from '@gw2treasures/eslint-plugin-nextjs';
import reactCompiler from 'eslint-plugin-react-compiler';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
  baseDirectory: import.meta.url,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default tseslint.config(
  { ignores: ['.next'] },
  ...compat.extends('next/core-web-vitals', '@gw2treasures/eslint-config/react'),
  {
    plugins: {
      '@gw2treasures/nextjs': nextJsPlugin,
      'react-compiler': reactCompiler,
    },
  },
  {
    files: ['**/page.tsx'],
    rules: {
      '@gw2treasures/nextjs/require-metadata': 'warn',
    },
  }, {
    files: ['eslint.config.mjs'],
    // eslint-disable-next-line import/no-named-as-default-member
    extends: [tseslint.configs.disableTypeChecked],
  }
);
