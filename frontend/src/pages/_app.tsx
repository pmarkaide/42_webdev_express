// src/pages/_app.tsx
import React, { useState } from 'react';
import { AppProps } from 'next/app';
import Header from '../components/Header';
import Main from '../components/Main';
import './global.css';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div>
      <Header onSearch={setSearchQuery} />
      <Main searchQuery={searchQuery} />
      <Component {...pageProps} />
    </div>
  );
};

export default App;