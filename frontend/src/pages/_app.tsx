// src/pages/_app.tsx
import { AppProps } from 'next/app';
import './global.css'; // Ensure to import your global CSS file

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
