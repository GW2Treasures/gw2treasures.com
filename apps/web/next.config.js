const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
    reactCompiler: true,
    ppr: 'incremental'
  },
  redirects: () => [{ source: '/wizardsvault', destination: '/wizards-vault', permanent: true }],
  transpilePackages: ['@gw2treasures/ui'],
  output: 'standalone',
};

module.exports = nextConfig;
