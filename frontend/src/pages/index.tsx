import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Main from '../components/Main';

import Link from 'next/link';


const Home: React.FC = () => {
  return (
    <div>
      <Header />
		  <Main />
      <Footer />
    </div>
  );
};

export default Home;

