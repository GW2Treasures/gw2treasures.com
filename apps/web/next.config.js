const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin');
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    swcPlugins: [['next-superjson-plugin', {}]],
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
  reactStrictMode: true,
  output: 'standalone',
  swcMinify: true,
  webpack(config, { isServer }) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [{ loader: '@svgr/webpack', options: { ref: true }}],
    });

    if(isServer) {
      config.plugins.push(new PrismaPlugin());
    }

    return config;
  },
};

module.exports = nextConfig;
