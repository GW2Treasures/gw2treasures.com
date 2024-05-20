import 'server-only';

import '../../styles/globals.css';
import '../../styles/variables.css';

import { FormatProvider } from '@/components/Format/FormatContext';
import Layout from '@/components/Layout/Layout';
import { Bitter } from 'next/font/google';
import localFont from 'next/font/local';
import { cx } from '@gw2treasures/ui';
import { I18nProvider } from '@/components/I18n/I18nProvider';
import type { Language } from '@gw2treasures/database';
import { ItemTableContext } from '@/components/ItemTable/ItemTableContext';
import { Gw2ApiProvider } from '@/components/Gw2Api/Gw2ApiProvider';
import { UserProvider } from '@/components/User/UserProvider';
import { DataTableContext } from '@gw2treasures/ui/components/Table/DataTableContext';
import { Gw2AccountSubscriptionProvider } from '@/components/Gw2Api/Gw2AccountSubscriptionProvider';
import type { ReactNode } from 'react';

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
  modal,
  params,
}: {
  children: ReactNode;
  modal?: ReactNode;
  params: { language: Language; };
}) {
  return (
    <html lang={params.language} className={cx(bitter.variable, wotfard.variable)}>
      <head>
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#b7000d"/>
        <meta httpEquiv="origin-trial" content="AjYEGXQiv6Eh2jKsaJ42xEdyFjlIDI61UGOalti/W3vhl/QeG+cG4lMCAJwG78ffAB+12o6iKL8kSfAtUmaMVAkAAAByeyJvcmlnaW4iOiJodHRwczovL2d3MnRyZWFzdXJlcy5jb206NDQzIiwiZmVhdHVyZSI6IldlYkFwcFNjb3BlRXh0ZW5zaW9ucyIsImV4cGlyeSI6MTcxOTM1OTk5OSwiaXNTdWJkb21haW4iOnRydWV9"/>
      </head>
      <body>
        <I18nProvider language={params.language}>
          <FormatProvider>
            <ItemTableContext global id="global">
              <DataTableContext>
                <UserProvider>
                  <Gw2ApiProvider>
                    <Gw2AccountSubscriptionProvider>
                      <Layout>{children}</Layout>
                      {modal}
                    </Gw2AccountSubscriptionProvider>
                  </Gw2ApiProvider>
                </UserProvider>
              </DataTableContext>
            </ItemTableContext>
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

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fff' },
    { media: '(prefers-color-scheme: dark)', color: '#36393f' },
  ],
};
