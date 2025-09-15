import type { NextConfig } from 'next';
import path from 'node:path';

// @ts-expect-error no types available
import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin';

const nextConfig: NextConfig = {
  // publish as standalone docker images
  output: 'standalone',

  // add deploymentId
  deploymentId: process.env.DEPLOYMENT_ID || undefined,

  // enable experimental features
  experimental: {
    reactCompiler: true,

    // generate server source maps for better errors
    serverSourceMaps: true,

    // taint is not actually used, this is just to opt Next.js into using react@experimental,
    // so other APIs become available (e.g. useEffectEvent)
    taint: true,

    // typed environment variables (.env)
    typedEnv: true,
  },

  // enable production source maps
  productionBrowserSourceMaps: true,

  // Allow cross-origin requests during development
  allowedDevOrigins: ['*.gw2treasures.localhost'],

  // disable eslint/typescript during some CI jobs, as there are separate jobs for it
  eslint: { ignoreDuringBuilds: !!process.env.SKIP_LINT },
  typescript: { ignoreBuildErrors: !!process.env.SKIP_TYPES },

  // transpile @gw2treasures/ui package
  outputFileTracingRoot: path.join(__dirname, '../../'),
  transpilePackages: ['@gw2treasures/ui'],

  // add PrismaPlugin to ensure that prisma engines are bundled correctly
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }

    return config;
  },

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
