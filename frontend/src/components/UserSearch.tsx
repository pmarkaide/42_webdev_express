import React, { useState } from 'react';
import { CiSearch } from "react-icons/ci";
import { MdCancel } from "react-icons/md";
import { useRouter } from 'next/router';

const UserSearch = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  // Handle the search input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Toggle search bar visibility
  const toggleSearchBar = () => {
    setShowSearch(!showSearch);
    setSearchTerm(''); // Clear the search term when toggling
  };

  // Handle form submission
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Retrieve the token from local storage
		const token = localStorage.getItem('token');

		console.log(token)

    try {
      const response = await fetch(`http://localhost:3006/api/users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
			});

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

			const users = await response.json();

			console.log(users)
      // Check if any user matches the search term (case insensitive)
      const foundUser = users.find((user: { username: string }) =>
        user.username.toLowerCase() === searchTerm.toLowerCase()
			);

			console.log(foundUser)

      if (foundUser) {
        // Assuming the user link is based on their username
        router.push(`/user/${foundUser.user_id}`); // Change this based on your routing setup
      } else {
        alert('User not found');
      }

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="user-search flex">
      {showSearch && (
        <form onSubmit={handleSearchSubmit} className="search-bar flex items-center">
          <input
            type="text"
            placeholder="Search for a user..."
            value={searchTerm}
            onChange={handleInputChange}
            className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-full"
          />
        </form>
      )}
      <button
        onClick={toggleSearchBar}
        className="toggle-button text-black py-2 px-4 rounded-md hover:bg-blue-200">
        {showSearch ? <MdCancel /> : <CiSearch />}
      </button>

      {/* Render search results (mockup) */}
      {showSearch && searchTerm && (
        <div className="search-results mt-4">
          {/* You could map through search results here */}
        </div>
      )}
    </div>
  );
};

export default UserSearch;
