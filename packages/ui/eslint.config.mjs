import { defineConfig } from 'eslint/config';

import reactConfig from '@gw2treasures/eslint-config/react';

export default defineConfig(
  ...reactConfig,

  // temporarily change some react-hook rules to warn:
  {
    rules: {
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/refs': 'warn',
    }
  },
);
