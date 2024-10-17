// src/pages/_app.tsx
import React, { useState } from 'react';
import { AppProps } from 'next/app';
import Header from '@/components/Header';
import Main from '@/components/Main';
import './global.css';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const [searchQuery, setSearchQuery] = useState('');


    // Define a proper search handler function
    const handleSearch = (query: string) => {
      setSearchQuery(query);
      // Add any additional search logic here if needed
      console.log('Searching for:', query);
    };

    return (
      <div>
        <Header onSearch={handleSearch} />
        <Main searchQuery={searchQuery} />
        <Component {...pageProps} />
      </div>
    );
  };

export default App;