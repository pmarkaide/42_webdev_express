import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface SidebarProps {
	onEditProfileClick: () => void;
	onFriendsClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onEditProfileClick, onFriendsClick }) => {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string } | null>(null); // Adjust the type based on your user structure

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      setUser(JSON.parse(userString)); // Parse the user data
    }
	}, []);

	const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <div className="md:translate-x-0 md:shadow-none md:w-64 h-full border border-gray-300 rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Hi, {user?.name}</h2>
      <ul className='pt-6'>
        <li
          className="mb-6 cursor-pointer hover:text-blue-500"
          onClick={onEditProfileClick} // Trigger the modal open function
        >
          Edit Profile
        </li>
        <li
          className="mb-6 cursor-pointer hover:text-blue-500"
          onClick={onFriendsClick}
        >
          Friends
        </li>
        <li
          className="mb-6 cursor-pointer hover:text-blue-500"
          onClick={handleLogout}
        >
          Log Out
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
