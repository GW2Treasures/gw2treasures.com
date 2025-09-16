import 'server-only';

import '../../styles/globals.css';
import '../../styles/variables.css';

import { FormatProvider } from '@/components/Format/FormatContext';
import Layout from '@/components/Layout/Layout';
import { Bitter } from 'next/font/google';
import localFont from 'next/font/local';
import { cx } from '@gw2treasures/ui';
import { I18nProvider } from '@/components/I18n/I18nProvider';
import { ItemTableContext } from '@/components/ItemTable/ItemTableContext';
import { Gw2ApiProvider } from '@/components/Gw2Api/Gw2ApiProvider';
import { UserProvider } from '@/components/User/UserProvider';
import { DataTableContext } from '@gw2treasures/ui/components/Table/DataTableContext';
import type { ReactNode } from 'react';
import type { LayoutProps } from '@/lib/next';
import type { Viewport } from 'next';
import { Gw2MeProvider } from '@/components/gw2me/gw2me-context';
import { client_id } from '@/lib/gw2me';
import { AchievementProgressTypeProvider } from '@/components/Achievement/AchievementProgressTypeContext';
import { getLanguage } from '@/lib/translate';
import { SynchronizedTimeProvider } from '@/components/Time/synchronized-time';

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

export default async function RootLayout({ children, modal }: LayoutProps & { modal?: ReactNode }) {
  const language = await getLanguage();

  return (
    <html lang={language} className={cx(bitter.variable, wotfard.variable)}>
      <head>
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#b7000d"/>
      </head>
      <body>
        <I18nProvider language={language}>
          <SynchronizedTimeProvider>
            <FormatProvider>
              <ItemTableContext global id="global">
                <DataTableContext>
                  <UserProvider>
                    <Gw2MeProvider clientId={client_id} baseUrl={process.env.GW2ME_URL}>
                      <Gw2ApiProvider>
                        <AchievementProgressTypeProvider>
                          <Layout language={language}>{children}</Layout>
                          {modal}
                        </AchievementProgressTypeProvider>
                      </Gw2ApiProvider>
                    </Gw2MeProvider>
                  </UserProvider>
                </DataTableContext>
              </ItemTableContext>
            </FormatProvider>
          </SynchronizedTimeProvider>
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
  keywords: [
    'guild wars 2', 'gw2', 'arenanet', 'anet', 'database', 'tool',
    'tradingpost', 'tp', 'history', 'buy', 'sell', 'black lion', 'bltc',
    'item', 'achievement', 'wizards vault', 'homestead', 'skin', 'skill', 'fractal', 'strike', 'raid', 'event', 'festival',
    'api', 'account', 'inventory', 'progress', 'recipe', 'crafting', 'mystic forge', 'material', 'wallet'
  ],
  manifest: '/site.webmanifest',
  applicationName: 'gw2treasures.com',
  appleWebApp: {
    capable: true,
    title: 'gw2treasures.com',
    statusBarStyle: 'default',
  },
  openGraph: {
    siteName: 'gw2treasures.com',
  },
  twitter: {
    site: '@gw2treasures',
  },
  formatDetection: { address: false, date: false, email: false, telephone: false, url: false },
  icons: {
    apple: { url: '/apple-touch-icon.png', sizes: '180x180' },
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

export const viewport: Viewport = {
  // Browsers use the first theme-color with matching media, discord always uses the last one for the link preview.
  // This way we can use the brand color for discord, while using the background color in browsers.
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fff' },
    { media: '(prefers-color-scheme: dark)', color: '#36393f' },
    { color: '#b7000d' },
  ],
};
