import '@/styles/globals.css'
import "allotment/dist/style.css";
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        headings: {fontFamily: 'Inter, sans-serif' },
      }}
    >
    <Layout>
        <NotificationsProvider>
      <Component {...pageProps} />
        </NotificationsProvider>
    </Layout>
    </MantineProvider>
  );
}
