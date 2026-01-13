import { requireMetadata } from './require-metadata.js';

import packageJson from '../package.json' with { type: 'json' };

// define plugin
const plugin = {
  meta: { name: packageJson.name, version: packageJson.version },
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

export default plugin;
