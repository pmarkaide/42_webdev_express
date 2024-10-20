import { AppProps } from 'next/app';
import { SessionProvider } from "next-auth/react";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './global.css';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </SessionProvider>
  );
}

export default MyApp;
