import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import User from '../components/User';
import Header from '../components/Header';
import Footer from '@/components/Footer';

const UserDetail: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return (
    <>
      <Header />
      <User />
      <Footer />
    </>
  );
};

export default UserDetail;
