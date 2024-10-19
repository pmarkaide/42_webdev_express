import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import pokeBall from '@/assests/logo.png'; 

interface HeaderProps {
	onSearch?: (query: string) => void;
  }

  const Header: React.FC<HeaderProps> = ({ onSearch }) => {
	const [searchQuery, setSearchQuery] = useState('');
	const router = useRouter();
  
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	  setSearchQuery(e.target.value);
	  onSearch?.(e.target.value);
	};

	const handleSearchSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!searchQuery.trim()) return;
	
		try {
			// Convert search query to lowercase for case-insensitive comparison
			const pokemonName = searchQuery.toLowerCase().trim();
			const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
			
			if (response.ok) {
			  const data = await response.json();
			  router.push(`/pokemon/${data.id}`);
			} else {
			  // Optionally handle pokemon not found
			  alert('Pokemon not found!');
			}
		  } catch (error) {
			console.error('Error searching pokemon:', error);
			alert('Error searching pokemon. Please try again.');
		  }
		};

		const isDetailPage = router.pathname.includes('/pokemon/');

		return (
			<header className="fixed inset-x-0 top-0 z-30 mx-auto w-full max-w-screen-md border border-gray-100 bg-white/80 py-3 shadow backdrop-blur-lg md:top-6 md:rounded-3xl lg:max-w-screen-lg">
			  <div className="px-4">
				<div className="flex items-center justify-between">
				  <div className="flex shrink-0">
					<a aria-current="page" className="flex items-center w-10" href="/">
					  <Image src={pokeBall} alt="Poke Ball" width={40} height={40} />
					  <p className="sr-only">Website Title</p>
					</a>
				  </div>
				  <div className="flex items-center justify-end gap-3">
					{!isDetailPage && (
					  <form onSubmit={handleSearchSubmit} className="flex items-center">
						<input
						  type="text"
						  value={searchQuery}
						  onChange={handleSearchChange}
						  placeholder="Search Pokemon..."
						  className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-150 hover:bg-gray-50"
						/>
						<button
						  type="submit"
						  className="ml-2 inline-flex items-center justify-center rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-blue-500"
						>
						  Search
						</button>
					  </form>
					)}
					<div className="flex items-center justify-end gap-3">
					  <a className="hidden items-center justify-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-150 hover:bg-gray-50 sm:inline-flex"
						href="/login">Sign in</a>
					  <a className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
						href="/login">Login</a>
					</div>
				  </div>
				</div>
			  </div>
			</header>
		  );
		};

export default Header;
