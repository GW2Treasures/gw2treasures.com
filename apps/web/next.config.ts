import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
  },
  eslint: {
    ignoreDuringBuilds: !!process.env.SKIP_LINT
  },
  typescript: {
    ignoreBuildErrors: !!process.env.SKIP_TYPES
  },
  redirects: () => Promise.resolve([
    { source: '/wizardsvault', destination: '/wizards-vault', permanent: true },
    { source: '/homestead', destination: '/homestead/nodes', permanent: true },
  ]),
  outputFileTracingRoot: path.join(__dirname, '../../'),
  transpilePackages: ['@gw2treasures/ui'],
  output: 'standalone',
};

export default nextConfig;
