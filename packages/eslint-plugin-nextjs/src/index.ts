import { requireMetadata } from './require-metadata';

// `import`ing here would bypass the TSConfig's `"rootDir": "src"`
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { name, version } = require('../package.json') as typeof import('../package.json');

// define plugin
const plugin = {
  meta: { name, version },
  configs: {
    get recommended() {
      return recommended;
    },
  },
  rules: {
    'require-metadata': requireMetadata
  }
};

// add recommended config
const recommended = {
  plugins: { '@gw2treasures/nextjs': plugin },
  files: ['**/page.tsx'],
  rules: {
    '@gw2treasures/nextjs/require-metadata': 'warn',
  },
};

export = plugin;
