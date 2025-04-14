import ts from 'typescript-eslint';
import react from 'eslint-plugin-react';
import config from './index.mjs';

export default ts.config(
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  config,
  {
    rules: {
      // `<C foo='bar'>` → `<C foo="bar">`
      "@stylistic/jsx-quotes": ["warn", "prefer-double"],
        
      // `< C / >` → `<C/>`
      "@stylistic/jsx-tag-spacing": ["warn", {
        "closingSlash": "never",
        "beforeSelfClosing": "never",
        "afterOpening": "never",
        "beforeClosing": "never"
      }],

      // `<C prop={'test'}/>` → `<C prop="test"/>`
      "@stylistic/jsx-curly-brace-presence": ["warn", "never"],

      // add parens around jsx
      "@stylistic/jsx-wrap-multilines": ["warn", {
        "declaration": "parens-new-line",
        "assignment": "parens-new-line",
        "return": "parens-new-line",
        "arrow": "parens-new-line",
        "condition": "parens-new-line",
        "logical": "parens-new-line",
        "prop": "parens-new-line"
      }],

      // multiline closing bracket location
      "@stylistic/jsx-closing-bracket-location": ["warn", {
        "nonEmpty": "line-aligned",
        "selfClosing": "after-props"
      }],

      // indent jsx with 2 spaces
      "@stylistic/jsx-indent": ["warn", 2, { "checkAttributes": true, "indentLogicalExpressions": true }],

      // indent props with 2 spaces
      "@stylistic/jsx-indent-props": ["warn", 2],

      // disallows using the array index as key
      "react/no-array-index-key": "warn",

      // `<Foo></Foo>` → `<Foo/>`
      "react/self-closing-comp": "warn",

      // `<Foo bar={true}>` → `<Foo bar/>`
      "react/jsx-boolean-value": "warn",

      // align the closing JSX tag with the opening tag
      "@stylistic/jsx-closing-tag-location": "warn",

      // `<React.Fragment>` → `<>`
      "react/jsx-fragments": "warn",

      // require key
      "react/jsx-key": ["warn", { "checkFragmentShorthand": true }],

      // prevent multiple spaces in jsx
      "@stylistic/jsx-props-no-multi-spaces": "warn",

      // `<Foo bar={ baz }>` → `<Foo bar={baz}/>`
      "@stylistic/jsx-curly-spacing": "warn",
    }
  }
);
