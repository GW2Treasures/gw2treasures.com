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
  }
};

export const generateStaticParams = function generateStaticParams() {
  return [{ language: 'de' }, { language: 'en' }, { language: 'es' }, { language: 'fr' }];
};
