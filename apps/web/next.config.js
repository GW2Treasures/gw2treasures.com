const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
    serverActions: {
      allowedOrigins: process.env.NODE_ENV === 'development' ? [
        'de.gw2treasures.localhost:3000', 
        'en.gw2treasures.localhost:3000', 
        'es.gw2treasures.localhost:3000', 
        'fr.gw2treasures.localhost:3000'
      ] : undefined
    }
  },
  transpilePackages: ['@gw2treasures/ui'],
  reactStrictMode: true,
  output: 'standalone',
  swcMinify: true,
};

module.exports = nextConfig;
