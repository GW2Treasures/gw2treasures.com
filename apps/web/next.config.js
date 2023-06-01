const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin');
const path = require('path');
const withSvgIcons = require('@gw2treasures/ui/svg-loader');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
  transpilePackages: ['@gw2treasures/ui'],
  reactStrictMode: true,
  output: 'standalone',
  swcMinify: true,
  webpack(config, { isServer }) {
    withSvgIcons(config);

    if(isServer) {
      config.plugins.push(new PrismaPlugin());
    }

    return config;
  },
};

module.exports = nextConfig;
