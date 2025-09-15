import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import config from './index.mjs';
import { defineConfig } from 'eslint/config';

export default defineConfig(
  // extend eslint-plugin-react
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],

  // auto-detect react version
  {
    settings: {
      react: { version: 'detect' }
    }
  },

  // extends eslint-plugin-react-hooks
  reactHooks.configs['recommended-latest'],

  // extend ./index
  config,

  // custom rules for react
  {
    rules: {
      // `<C foo='bar'>` → `<C foo="bar">`
      '@stylistic/jsx-quotes': ['warn', 'prefer-double'],

      // `< C / >` → `<C/>`
      '@stylistic/jsx-tag-spacing': ['warn', {
        'closingSlash': 'never',
        'beforeSelfClosing': 'never',
        'afterOpening': 'never',
        'beforeClosing': 'never'
      }],

      // `<C prop={'test'}/>` → `<C prop="test"/>`
      '@stylistic/jsx-curly-brace-presence': ['warn', 'never'],

      // add parens around jsx
      '@stylistic/jsx-wrap-multilines': ['warn', {
        'declaration': 'parens-new-line',
        'assignment': 'parens-new-line',
        'return': 'parens-new-line',
        'arrow': 'parens-new-line',
        'condition': 'parens-new-line',
        'logical': 'parens-new-line',
        'prop': 'parens-new-line'
      }],

      // multiline closing bracket location
      '@stylistic/jsx-closing-bracket-location': ['warn', {
        'nonEmpty': 'line-aligned',
        'selfClosing': 'after-props'
      }],

      // indent props with 2 spaces
      '@stylistic/jsx-indent-props': ['warn', 2],

      // disallows using the array index as key
      'react/no-array-index-key': 'warn',

      // `<Foo></Foo>` → `<Foo/>`
      'react/self-closing-comp': 'warn',

      // `<Foo bar={true}>` → `<Foo bar/>`
      'react/jsx-boolean-value': 'warn',

      // align the closing JSX tag with the opening tag
      '@stylistic/jsx-closing-tag-location': 'warn',

      // `<React.Fragment>` → `<>`
      'react/jsx-fragments': 'warn',

      // require key
      'react/jsx-key': ['warn', { 'checkFragmentShorthand': true }],

      // `<Foo bar={ baz }>` → `<Foo bar={baz}/>`
      '@stylistic/jsx-curly-spacing': 'warn',
    }
  }
);
