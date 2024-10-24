import React, { useState, useEffect, useRef } from 'react';
import { User } from '@/types/type_User';
import Image from 'next/image';
import defaultAvatar from '../assests/default_avatar.jpg';
import { Search } from 'lucide-react';

const UserSearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.trim() === '') {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_MY_BACKEND_API_URL}/api/users/search?query=${searchQuery}`);
        const data = await response.json();
        setSearchResults(data);
        setIsDropdownOpen(true);
      } catch (error) {
        console.error('Error searching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(searchUsers, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <div className="relative w-64" ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isDropdownOpen && searchResults.length > 0 && (
        <div className="absolute mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
          {searchResults.map((user) => (
            <a
              key={user.user_id}
              href={`/user/${user.user_id}`}
              className="flex items-center px-4 py-2 hover:bg-gray-50"
            >
              <Image
                src={user.image || defaultAvatar}
                alt={user.username}
                width={32}
                height={32}
                className="rounded-full"
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user.username}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </a>
          ))}
        </div>
      )}

      {isLoading && (
        <div className="absolute mt-1 w-full rounded-lg border border-gray-200 bg-white p-4 text-center">
          Loading...
        </div>
      )}
    </div>
  );
};

export default UserSearchBar;