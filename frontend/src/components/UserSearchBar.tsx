import React, { useState, useEffect, useRef } from 'react';
import { User } from '@/types/type_User';
import { Search } from 'lucide-react';

const UserSearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

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
      // Previous code remains the same...
  
      try {
        // API call code remains the same...
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          // Request was aborted, do nothing
          return;
        }
        
        console.error('Error searching users:', err);
        
        // Proper type narrowing for the error
        let errorMessage: string;
        if (err instanceof Error) {
          errorMessage = err.message;
        } else if (typeof err === 'string') {
          errorMessage = err;
        } else {
          errorMessage = 'Failed to search users';
        }
        
        setError(errorMessage);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the search
    const timeoutId = setTimeout(searchUsers, 300);

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [searchQuery]);

  const handleUserSelect = (user: User) => {
    console.log('Selected user:', user);
    setSearchQuery('');
    setIsDropdownOpen(false);
  };

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
          onFocus={() => searchQuery.trim() && setIsDropdownOpen(true)}
        />
      </div>

      {(isDropdownOpen || isLoading) && (
        <div className="absolute mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg max-h-60 overflow-y-auto z-50">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              Searching...
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">
              {error}
            </div>
          ) : searchResults.length > 0 ? (
            searchResults.map((user) => (
              <div
                key={user.user_id}
                onClick={() => handleUserSelect(user)}
                className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {user.username || user.name}
                    </p>
                    {user.email && (
                      <p className="text-xs text-gray-500">{user.email}</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : searchQuery.trim() !== '' && (
            <div className="p-4 text-center text-gray-500">
              No users found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserSearchBar;