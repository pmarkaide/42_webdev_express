import React from 'react';
import { useRouter } from 'next/router';

const Sidebar: React.FC = () => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="md:translate-x-0 md:shadow-none md:w-64 border border-gray-300 rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Settings</h2>
      <ul>
        <li className="mb-2 cursor-pointer hover:text-blue-500" onClick={() => handleNavigation('/profile')}>
          Edit Profile
        </li>
        <li className="mb-2 cursor-pointer hover:text-blue-500" onClick={() => handleNavigation('/friends')}>
          Friends
        </li>
        <li className="mb-2 cursor-pointer hover:text-blue-500" onClick={() => console.log("log out")}>
          Log Out
        </li>
        {/* Add more sidebar links as needed */}
      </ul>
    </div>
  );
};

export default Sidebar;
