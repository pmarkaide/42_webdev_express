import React from 'react';
import { AppProps } from 'next/app';
import './global.css';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Component {...pageProps} />
      </main>
    </div>
  );
};

export default App;