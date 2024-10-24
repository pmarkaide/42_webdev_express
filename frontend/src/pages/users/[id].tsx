import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { User } from '@/types/type_User';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import Card from '@/components/Card';
import { PokeDetail } from '@/types/type_Pokemon';
import defaultAvatar from '@/assets/default_avatar.jpg';
import Image from 'next/image';

const UserProfile: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (id) {
      fetchUserDetails(id as string);
    }
  }, [id]);

  const fetchUserDetails = async (userId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_MY_BACKEND_API_URL}/api/users/${userId}`);
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col mt-36 w-10/12 mx-auto">
      <div className="md:hidden">
        <Topbar />
      </div>
      <div className="flex flex-1">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main className="flex-1 p-6 bg-white shadow-lg rounded-lg">
          <div className="flex items-center space-x-6 mb-6">
            <div className="relative w-24 h-24">
              <Image
                className="rounded-full border"
                src={user.image || defaultAvatar}
                alt={`${user.name}'s avatar`}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name || user.username}</h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Liked Pokémon</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {user.favorites ? (
              user.favorites.map((pokemon: PokeDetail) => (
                <Card key={pokemon.name} pokemon={pokemon} userPageMode={true} user={user} isFavorite={false} />
              ))
            ) : (
              <p className="text-gray-600">No liked Pokémon yet.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserProfile;