import nextJsPlugin from '@gw2treasures/eslint-plugin-nextjs';
import reactConfig from '@gw2treasures/eslint-config/react';
import reactCompiler from 'eslint-plugin-react-compiler';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';
import { flatConfig as nextConfig } from '@next/eslint-plugin-next';

export default tseslint.config(
  // ignore all files in .next
  { ignores: ['.next'] },

  // extends next core-web-vitals
  nextConfig.coreWebVitals,

  // extends react configs
  ...reactConfig,

  // extends react-hooks
  reactHooks.configs['recommended-latest'],

  // enable enable react-compiler plugin (no flat preset yet)
  {
    plugins: { 'react-compiler': reactCompiler },
    rules: reactCompiler.configs.recommended.rules
  },
  
  // enable @gw2treasures/nextjs plugin for page.tsx files (no flat preset yet)
  {
    files: ['**/page.tsx'],
    plugins: { '@gw2treasures/nextjs': nextJsPlugin },
    rules: {
      '@gw2treasures/nextjs/require-metadata': 'warn',
    },
  },
);
