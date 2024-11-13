import type { NextConfig } from 'next';
import path from 'path';

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

  // permanently redirected pages
  redirects: () => Promise.resolve([
    { source: '/wizardsvault', destination: '/wizards-vault', permanent: true },
    { source: '/homestead', destination: '/homestead/nodes', permanent: true },
  ]),
};

export default nextConfig;
