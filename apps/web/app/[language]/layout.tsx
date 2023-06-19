import 'server-only';

import '../../styles/globals.css';
import '../../styles/variables.css';

import { FormatProvider } from '@/components/Format/FormatContext';
import Layout from '@/components/Layout/Layout';
import { Bitter } from 'next/font/google';
import localFont from 'next/font/local';
import { cx } from '@gw2treasures/ui';
import { I18nProvider } from '@/components/I18n/I18nProvider';
import { Language } from '@gw2treasures/database';

const bitter = Bitter({
  subsets: ['latin'],
  weight: '700',
  variable: '--font-bitter',
});

const wotfard = localFont({
  src: [
    { path: '../../fonts/wotfard-regular-webfont.woff2', weight: '400' },
    { path: '../../fonts/wotfard-medium-webfont.woff2', weight: '500' },
  ],
  variable: '--font-wotfard',
});

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { language: Language; };
}) {
  return (
    <html lang={params.language} className={cx(bitter.variable, wotfard.variable)}>
      <head>
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#b7000d"/>
      </head>
      <body>
        <I18nProvider language={params.language}>
          <FormatProvider>
            <Layout>{children}</Layout>
          </FormatProvider>
        </I18nProvider>
      </body>
    </html>
  );
}

export const metadata = {
  title: {
    template: '%s · gw2treasures.com',
    default: ''
  },
  description: 'Guild Wars 2 Database and tool collection',
  manifest: '/site.webmanifest',
  applicationName: 'gw2treasures.com',
  appleWebApp: {
    capable: true,
    title: 'gw2treasures.com',
    statusBarStyle: 'default',
  },
  formatDetection: { address: false, date: false, email: false, telephone: false, url: false },
  themeColor: '#b7000d',
  icons: {
    apple: { url: 'apple-touch-icon.png', sizes: '180x180' },
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
    ],
    shortcut: { url: '/favicon.ico', type: 'image/x-icon', sizes: 'any' },
  },
  other: {
    'msapplication-TileColor': '#b91d47'
  }
};

export const generateStaticParams = function generateStaticParams() {
  return [{ language: 'de' }, { language: 'en' }, { language: 'es' }, { language: 'fr' }];
};
