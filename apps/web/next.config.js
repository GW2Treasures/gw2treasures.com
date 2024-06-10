const path = require('path');
const webpack = require('webpack');

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
  webpack: (config) => {
    config.node = { global: false };
    config.plugins.push(new webpack.ProvidePlugin({
      global: require.resolve('./global.js')
    }));

    return config;
  }
};

module.exports = nextConfig;
