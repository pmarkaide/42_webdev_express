import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Main from '../components/Main';

const Home: React.FC = () => {
  return (
    <div>
      <Header />
      <Main /> {/* List of Pokémon */}
      <Footer />
    </div>
  );
};

export default Home;

