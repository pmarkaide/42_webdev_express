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
			<div className="flex justify-center mt-4">
        <Link href="/login">
          <button className="text-blue-500 hover:underline">Login</button>
        </Link>
        <span className="mx-2">|</span>
        <Link href="/signup">
          <button className="text-blue-500 hover:underline">Sign Up</button>
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default Home;

