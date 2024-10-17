// pages/login.tsx

import React from 'react';
import Login from '../components/Login';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const LoginPage: React.FC = () => {
  return (
	<div>
		<Header />
		<Login />
		<Footer />
    </div>
  );
};

export default LoginPage;
