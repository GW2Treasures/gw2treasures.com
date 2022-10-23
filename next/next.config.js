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
    domains: [
      { domain: 'de.next.gw2treasures.localhost', defaultLocale: 'de', http: true },
      { domain: 'en.next.gw2treasures.localhost', defaultLocale: 'en', http: true },
      { domain: 'es.next.gw2treasures.localhost', defaultLocale: 'es', http: true },
      { domain: 'fr.next.gw2treasures.localhost', defaultLocale: 'fr', http: true },
    ],
    localeDetection: false,
  }
}

module.exports = nextConfig;
