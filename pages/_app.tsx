import 'styles/globals.css';
import Layout from 'components/layout';
import type { AppProps } from 'next/app';

// 入口
export default function App({ Component, pageProps }: AppProps) {
  return (
  <Layout>
    <Component {...pageProps} />
  </Layout>
  )
}
