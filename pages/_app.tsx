import 'styles/globals.css';
import Layout from 'components/layout';
import type { AppProps } from 'next/app';
import { StoreProvider } from 'store';

// 入口
export default function App({ Component, pageProps }: AppProps) {
  return (
  <StoreProvider initialValue={{user:{}}}>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </StoreProvider>
  )
}
