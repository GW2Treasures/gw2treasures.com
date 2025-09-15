import nextJsPlugin from '@gw2treasures/eslint-plugin-nextjs';
import reactConfig from '@gw2treasures/eslint-config/react';
import reactCompiler from 'eslint-plugin-react-compiler';
import nextConfig from '@next/eslint-plugin-next';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig(
  // ignore Next.js generated files
  globalIgnores([
    '.next/',
    'next-env.d.ts'
  ]),

  // extends next/core-web-vitals
  nextConfig.flatConfig.coreWebVitals,

  // extend @gw2treasures/eslint-config/react
  ...reactConfig,

  // enable enable react-compiler plugin (no flat preset yet)
  {
    plugins: { 'react-compiler': reactCompiler },
    rules: reactCompiler.configs.recommended.rules
  },

  // enable @gw2treasures/nextjs plugin for page.tsx files (no flat preset yet)
  nextJsPlugin.configs.recommended,
);
