import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
  // publish as standalone docker images
  output: 'standalone',

  // add deploymentId
  deploymentId: process.env.DEPLOYMENT_ID || undefined,

  // enable experimental features
  experimental: {
    // generate server source maps for better errors
    serverSourceMaps: true,

    // typed environment variables (.env)
    typedEnv: true,

    // enable next/root-params
    rootParams: true,
  },

  // enable production source maps
  productionBrowserSourceMaps: true,

  // Allow cross-origin requests during development
  allowedDevOrigins: ['*.gw2treasures.localhost'],

  // disable typechecking during some CI jobs, as there are separate jobs for it
  typescript: { ignoreBuildErrors: !!process.env.SKIP_TYPES },

  // transpile @gw2treasures/ui package
  outputFileTracingRoot: path.join(__dirname, '../../'),
  transpilePackages: ['@gw2treasures/ui'],

  reactCompiler: true,

  // permanently redirected pages
  redirects: () => Promise.resolve([
    { source: '/wizardsvault', destination: '/wizards-vault', permanent: true },
    { source: '/homestead', destination: '/homestead/nodes', permanent: true },
    { source: '/event/evon-gnashblades-birthday', destination: '/bonus-event/evon-gnashblades-birthday', permanent: true },
    { source: '/color', destination: '/colors', permanent: true },
    { source: '/skin', destination: '/skins', permanent: true },
    { source: '/skill', destination: '/skills', permanent: true },
  ]),
};

export default nextConfig;
