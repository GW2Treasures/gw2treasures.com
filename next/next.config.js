/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  swcMinify: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
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
