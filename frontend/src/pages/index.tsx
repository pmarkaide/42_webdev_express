import React, { useState } from 'react';
import Main from '../components/Main';
import Header from '../components/Header';
import Footer from '@/components/Footer';

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <Header onSearch={setSearchQuery} />
      <Main searchQuery={searchQuery} />
      <Footer />
    </>
  );
};

export default Home;
