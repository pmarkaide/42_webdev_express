import React, { useCallback, useEffect, useState } from 'react';
import Card from './Card';
import FilterBar from './FilterBar';
import { Pokemon, PokeDetail } from '../types/type_Pokemon';
import { pokemonTypes } from '../pokemonTypes'
import PaginationBtn from './PaginationBtn';
import SkeletonCard from './SkeletonCard';
import debounce from 'lodash/debounce';
import {User} from '@/types/type_User';
import { useRouter } from 'next/router';
import { CgPokemon } from 'react-icons/cg';
import { ToastContainer } from 'react-toastify';


const apiUrl = process.env.NEXT_PUBLIC_MY_BACKEND_API_URL;

interface MainProps {
  user: User | null;
	setUser: (user: User | null) => void;
}

const Main: React.FC<MainProps> = ({user, setUser}) =>
{
	const router = useRouter();
	//basic data
	const [pokeDetails, setPokeDetails] = useState<PokeDetail[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [loadingMore, setLoadingMore] = useState<boolean>(false);

	//sorting and filtering algorithm
	const [selectedType, setSelectedType] = useState('');
	const [sortBy, setSortBy] = useState('id');

	//pagination
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 32;

	// Search state
	const [searchTerm, setSearchTerm] = useState('');
	const [suggestions, setSuggestions] = useState<PokeDetail[]>([]);

	useEffect(() => {
		const token = localStorage.getItem('token');

		// if (!token) {
		// 	router.push('/login');
		// } else {
			const user_from_ls = localStorage.getItem('user');
			// setUserInLocalStorage(user_from_ls)
			if (user_from_ls)
			{
				const parsedUser = JSON.parse(user_from_ls);
				fetchUserDetails(parsedUser.user_id);
				// setUser(parsedUser);
			}
		//}
	}, [router]);

	const fetchUserDetails = async (id: number) =>
	{
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_MY_BACKEND_API_URL}/api/users/${id}`, {
			});
			const data = await response.json();
			setUser(data);
		} catch (error) {
			console.error('Failed to fetch user data:', error);
		}
	};

	const handleTypeChange = (type: string) => {
		setSelectedType(type);
		setCurrentPage(1);
	};

	const handleSortChange = (sortBy: string) => {
		setCurrentPage(1);
		setSortBy(sortBy);
	};

	const handleSearch = useCallback(
		debounce((term: string) => {
			setSearchTerm(term);
			if (term) {
				const filteredSuggestions = pokeDetails.filter(pokemon =>
					pokemon.name.toLowerCase().includes(term.toLowerCase())
				);
				setSuggestions(filteredSuggestions);
			} else {
				setSuggestions([]);
			}
		}, 300),
		[pokeDetails]
	);

	//modify this to our own api later
	useEffect(() => {
		const fetchPokemons = async () => {
			try {
				const response = await fetch(`${apiUrl}/api/pokemons_with_likes`);
				const data = await response.json();
				// const pokemonDetails = data.results.map(async (pokemon: Pokemon) => {
				// 	const detailResponse = await fetch(pokemon.url);
				// 	return detailResponse.json();
				// });
				// const details = await Promise.all(pokemonDetails);
				const details = await Promise.all(data);

				setPokeDetails(details);
			} catch (error) {
				console.error("Error fetching Pokémon data:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchPokemons();
	}, []);

	useEffect(() => {
	const fetchRemainingPokemons = async () => {
		setLoadingMore(true); // Set loading state for more Pokémon
		try {
			const response = await fetch(`${apiUrl}/api/pokemons_with_likes?offset=${32}&limit=${1025}`);
			// const response = await fetch('https://pokeapi.co/api/v2/pokemon?offset=32&limit=1025');
			const data = await response.json();
			//prev
			// const pokemonDetails = await Promise.all(
			// 	data.results.map(async (pokemon: Pokemon) => {
			// 		const detailResponse = await fetch(pokemon.url);
			// 		return detailResponse.json();
			// 	})
			// );
			//prev
			// setPokeDetails(prevDetails => [...prevDetails, ...pokemonDetails]); // Append new Pokémon to existing state
			//temp_new
			//consider usememo?

			if (!Array.isArray(data)) {
				console.error("Expected data to be an array, but got:", data);
				return;
			}
			setPokeDetails(prevDetails => {
				const existingNames = new Set(prevDetails.map(p => p.name)); // Set of existing Pokémon names
				const newPokemons = data.filter((p: PokeDetail) => !existingNames.has(p.name)); // Filter out duplicates

				return [...prevDetails, ...newPokemons]; // Merge without duplicates
			});
		} catch (error) {
			console.error("Error fetching more Pokémon data:", error);
		} finally {
			setLoadingMore(false);
		}
	};

    fetchRemainingPokemons();
	}, [loading]);

	const handleLikesChange = (pokemonId: string, newLikes: number) => {
    setPokeDetails((prevDetails) =>
      prevDetails.map((pokemon) =>
        pokemon.id === pokemonId ? { ...pokemon, likes: newLikes } : pokemon
      )
    );
  };

	//This part translate the data array first into filtered version, and then a sorted array
	const filteredPokemons = selectedType
		? pokeDetails.filter((pokemon) =>
			pokemon.types.some((type) => type.type.name === selectedType)
		)
		: pokeDetails;

	// const sortedPokemons = filteredPokemons.sort((a, b) => {
	// 	if (sortBy === 'id') {
	// 		return parseInt(a.id) - parseInt(b.id);
	// 	}
	// 		return a.name.localeCompare(b.name);
	// });

	const sortedPokemons = filteredPokemons.sort((a, b) =>
	{
		console.log(sortBy)
		if (sortBy === 'id') {
			return parseInt(a.id) - parseInt(b.id);
		} else if (sortBy === 'reverse-id')
		{
			return parseInt(b.id) - parseInt(a.id);
		} else if (sortBy === 'name')
		{
			return a.name.localeCompare(b.name);
		} else if (sortBy === 'reverse-name')
		{
			return b.name.localeCompare(a.name);
		} else if (sortBy === 'likes')
		{
			return a.likes - b.likes
		} else if (sortBy === 'reverse-likes')
		{
			return b.likes - a.likes
		}
			return parseInt(a.id) - parseInt(b.id);
	});

	// const sortedPokemons = filteredPokemons.sort((a, b) => {
	// 	if (sortBy === 'id') {
	// 		return parseInt(a.id) - parseInt(b.id);
	// 	}
	// 		return a.name.localeCompare(b.name);
	// });

	//page calculations
	const indexOfLastPokemon = currentPage * itemsPerPage;
	const indexOfFirstPokemon = indexOfLastPokemon - itemsPerPage;
	const currentPokemons = sortedPokemons.slice(indexOfFirstPokemon, indexOfLastPokemon);
	const totalPages = Math.ceil(sortedPokemons.length / itemsPerPage);

	if (loading) {
		return (
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 mt-60">
				{[...Array(itemsPerPage)].map((_, index) => (
					<SkeletonCard key={index} />
				))}
			</div>
		);
	}

  return (
		<div className='mt-32'>
			<ToastContainer />
			<FilterBar
				types={pokemonTypes}
				onSearch={handleSearch}
				suggestions={suggestions}
				setSearchTerm={setSearchTerm}
				onTypeChange={handleTypeChange}
				onSortChange={handleSortChange}
			/>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
				{currentPokemons.map((pokemon) => (
					<Card key={pokemon.name} pokemon={pokemon} userPageMode={false} isFavorite={user?.favorite_pokemon_ids?.includes(pokemon.id)} user={user} onLikesChange={handleLikesChange}/>
				))}
			</div>
			<PaginationBtn totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
		</div>
  );
};

export default Main;
