import React, { useCallback, useEffect, useState } from 'react';
import Card from './Card';
import FilterBar from './FilterBar';
import { Pokemon, PokeDetail } from '../types/type_Pokemon';
import { pokemonTypes } from '../pokemonTypes'
import PaginationBtn from './PaginationBtn';
import SkeletonCard from './SkeletonCard';
import debounce from 'lodash/debounce';

const Main: React.FC = () =>
{
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
				const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=32');
				const data = await response.json();
				const pokemonDetails = data.results.map(async (pokemon: Pokemon) => {
					const detailResponse = await fetch(pokemon.url);
					return detailResponse.json();
				});
				const details = await Promise.all(pokemonDetails);
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
        // Fetch more Pokémon (for example, the next 100)
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?offset=32&limit=1025'); // Change offset as needed
        const data = await response.json();
        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon: Pokemon) => {
            const detailResponse = await fetch(pokemon.url);
            return detailResponse.json();
          })
        );
        setPokeDetails(prevDetails => [...prevDetails, ...pokemonDetails]); // Append new Pokémon to existing state
      } catch (error) {
        console.error("Error fetching more Pokémon data:", error);
      } finally {
        setLoadingMore(false);
      }
    };

    fetchRemainingPokemons();
  }, [loading]);

	//This part translate the data array first into filtered version, and then a sorted array
	const filteredPokemons = selectedType
		? pokeDetails.filter((pokemon) =>
			pokemon.types.some((type) => type.type.name === selectedType)
		)
		: pokeDetails;

	const sortedPokemons = filteredPokemons.sort((a, b) => {
		if (sortBy === 'id') {
			return parseInt(a.id) - parseInt(b.id);
		}
			return a.name.localeCompare(b.name);
	});

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
					<Card key={pokemon.name} pokemon={pokemon} />
				))}
			</div>
			<PaginationBtn totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
		</div>
  );
};

export default Main;
