const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
  redirects: () => [{ source: '/wizardsvault', destination: '/wizards-vault', permanent: true }],
  transpilePackages: ['@gw2treasures/ui'],
  output: 'standalone',
};

module.exports = nextConfig;
