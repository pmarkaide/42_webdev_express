import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useSession } from "next-auth/react";
import { User } from '@/types/type_User';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import EditProfileForm from '@/components/EditProfileForm';
import FriendsList from '@/components/FriendsList';

const UserDetail: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [user, setUser] = useState<User>();
  const [likedPokemons, setLikedPokemons] = useState<any[]>([]);
  const [userInLocalStorage, setUserInLocalStorage] = useState<User | null>(null);
	const [isEditModalOpen, setEditModalOpen] = useState(false);

	const [friends, setFriends] = useState<{ id: number; name: string }[]>([]);
	const [showFriendsList, setShowFriendsList] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
		} else {
			const user_from_ls = localStorage.getItem('user');
			console.log(user_from_ls)
			if (user_from_ls)
			{
				const parsedUser = JSON.parse(user_from_ls);
        setUser(parsedUser);
			}
			else
			{
				fetchUserDetails(token);
			}
    }
  }, [router]);

  // useEffect(() => {
	// 	const user = localStorage.getItem('user');
	// 	console.log(user)
  //   if (user) {
  //     setUserInLocalStorage(JSON.parse(user));
  //   }
  // }, []);

  const fetchUserDetails = async (token: string) => {
    // if (userInLocalStorage) {
    //   const user = userInLocalStorage;
    //   setUser(user);
    // } else {
      try {
        const response = await fetch('/api/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUser(data.user);
				setLikedPokemons(data.likedPokemons);
				setFriends(data.friends || []);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    // }
	};

	const toggleFriendsList = () => {
    setShowFriendsList(prev => !prev);
  };

  // Calculate experience progress
  const calculateExperienceProgress = () => {
    if (!user) return 0;
    const { exp, level } = user;
    const expRequiredForNextLevel = level * 100;
    return (exp / expRequiredForNextLevel) * 100; // Returns percentage
  };

  // Function to open the edit modal
  const handleEditProfileClick = () => {
    setEditModalOpen(true);
  };

  // Function to close the edit modal
  const closeEditModal = () => {
    setEditModalOpen(false);
	};

	const closeFriendList = () =>
	{
		setShowFriendsList(false);
	}

  return (
		<div className="flex flex-col mt-36 w-10/12 mx-auto">
      <div className="md:hidden">
        <Topbar onFriendsClick={toggleFriendsList}/>
      </div>
      <div className="flex flex-1">
        <div className="hidden md:block">
					<Sidebar onEditProfileClick={handleEditProfileClick} onFriendsClick={toggleFriendsList}/>
        </div>
        <main className="flex-1 p-6 bg-white shadow-lg rounded-lg">
          <div className="flex items-center space-x-6 mb-6">
            <div className="relative w-24 h-24">
              <Image
                className="rounded-full border"
                src={user?.image || '/default-avatar.png'}
                alt={`${user?.name}'s avatar`}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
              <p className="text-gray-600">{user?.email}</p>
              {/* <button
                onClick={handleEditProfileClick}
                className="text-blue-500 hover:underline mt-2"
              >
                Edit Profile
              </button> */}
            </div>
          </div>
          <div className="mb-6">
            <p className="text-gray-600">Level: {user?.level}</p>
            <div className="relative h-4 bg-gray-300 rounded-full">
              <div
                className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                style={{ width: `${calculateExperienceProgress()}%` }}
              />
            </div>
            <p className="text-gray-600 text-sm">
              {user?.exp} / {(user?.level || 0) * 100} EXP
            </p>
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-4">Liked Pokémon</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {likedPokemons.length > 0 ? (
              likedPokemons.map((pokemon) => (
                <div
                  key={pokemon.id}
                  className="p-4 bg-gray-100 rounded-lg flex flex-col items-center shadow-md"
                >
                  <Image
                    className="mb-2"
                    src={pokemon.image}
                    alt={pokemon.name}
                    width={80}
                    height={80}
                    objectFit="contain"
                  />
                  <span className="text-lg font-semibold text-gray-800">{pokemon.name}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No liked Pokémon yet.</p>
            )}
          </div>
        </main>
      </div>
      {isEditModalOpen && (
        <EditProfileForm
          onClose={closeEditModal}
          initialData={{ name: user?.name || '', email: user?.email || '' }}
        />
			)}
			{showFriendsList && <FriendsList friends={friends} onClose={closeFriendList} />}
    </div>
  );
};

export default UserDetail;
