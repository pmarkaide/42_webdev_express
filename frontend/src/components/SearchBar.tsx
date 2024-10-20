// SearchBar.tsx
import React, { ChangeEvent } from 'react';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <input
      type="text"
      placeholder="Search Pokémon..."
      onChange={handleChange}
      className="border border-gray-300 rounded-md shadow-sm p-2 h-12 w-full md:w-80 lg:w-5/12 focus:border-blue-500 focus:ring focus:ring-blue-200" // Set height
    />
  );
};

export default SearchBar;
