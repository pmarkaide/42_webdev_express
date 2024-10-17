import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Main from './Main';

const Layout: React.FC<{ children: React.ReactNode }> = ({ }) => {
  return (
    <div>
      <Header />
      <Main />
      <Footer />
    </div>
  );
};

export default Layout;
