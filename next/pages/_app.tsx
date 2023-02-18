import '../styles/globals.css';
import '../styles/variables.css';
import '../styles/temp.css';
import '@fontsource/bitter/700.css';
import type { AppProps } from 'next/app';
import Layout from '@/components/Layout/Layout';
import { FormatProvider } from '@/components/Format/FormatContext';

function MyApp({ Component, pageProps }: AppProps) {
  return <FormatProvider><Layout><Component {...pageProps}/></Layout></FormatProvider>;
}

export default MyApp;
