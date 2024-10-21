import React from 'react';
import Image from 'next/image';
import { useSession } from "next-auth/react"; // Assuming you want to display the user info

const Topbar: React.FC = () => {
  const { data: session } = useSession(); // Get session data for user info

  return (
    <div className="flex items-center justify-between bg-white shadow-md p-4">
      <h1 className="text-xl font-semibold text-gray-900">Pokédex</h1>
      <div className="flex items-center space-x-4">
        {session?.user?.image && (
          <div className="relative w-10 h-10">
            <Image
              className="rounded-full border"
              src={session.user.image}
              alt="User Avatar"
              layout="fill"
              objectFit="cover"
            />
          </div>
        )}
        <span className="text-gray-800">{session?.user?.name || 'User'}</span>
        <button className="text-blue-500 hover:underline" onClick={() => console.log("Log out")}>
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Topbar;
