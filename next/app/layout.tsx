import '../styles/globals.css';
import '../styles/variables.css';
import '../styles/temp.css';
import '@fontsource/bitter/700.css';

import { FormatProvider } from '@/components/Format/FormatContext';
import Layout from '@/components/Layout/Layout';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body><FormatProvider><Layout>{children}</Layout></FormatProvider></body>
    </html>
  );
}
