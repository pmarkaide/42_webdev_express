import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import User from '../components/User';

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
      <User />
    </>
  );
};

export default UserDetail;
