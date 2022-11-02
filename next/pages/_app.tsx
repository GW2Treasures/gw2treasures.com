import '../styles/globals.css';
import '../styles/variables.css';
import '../styles/temp.css';
import '@fontsource/bitter/700.css';
import type { AppProps } from 'next/app';
import Layout from '../components/Layout/Layout';

function MyApp({ Component, pageProps }: AppProps) {
  return <Layout><Component {...pageProps}/></Layout>;
}

export default MyApp;
