/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    swcPlugins: [["next-superjson-plugin", {}]],
  },
  reactStrictMode: true,
  output: 'standalone',
  swcMinify: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [{ loader: '@svgr/webpack', options: { ref: true } }],
    });

    return config;
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['de', 'en', 'es', 'fr'],
    localeDetection: false,
  }
}

module.exports = nextConfig;
