import type { NextConfig } from 'next';
import path from 'path';

// @ts-expect-error no types available
import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin';

const nextConfig: NextConfig = {
  // publish as standalone docker images
  output: 'standalone',

  // enable experimental features
  experimental: {
    reactCompiler: true,
  },

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
  ]),
};

export default nextConfig;
