# `@gw2treasures/eslint-plugin-nextjs`

ESLint plugin with custom rules for Next.js.

## Useage

```json
{
  "plugins": ["@typescript-eslint", "@gw2treasures/nextjs"],
  "overrides": [{
    "files": ["**/page.tsx"],
    "rules": {
      "@gw2treasures/nextjs/require-metadata": "warn"
    }
  }]
}

```

## Installation

```
npm i -D @gw2treasures/eslint-plugin-nextjs
```

## License

**@gw2treasures/eslint-plugin-nextjs** is licensed under the [MIT License](./LICENSE).
