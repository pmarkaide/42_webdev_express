import { AppProps } from 'next/app';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './global.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </div>
  );
}

export default MyApp;
