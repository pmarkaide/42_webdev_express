import React, { useEffect, useState } from 'react';
import Card from './Card';
import { useRouter } from 'next/router';

interface Pokemon {
  name: string;
	url: string;
	img: string;
}
export interface TypeSlot {
	slot: number;
	type: {
	  name: string;
	  url: string;
	};
  }
export interface PokeDetail
{
	id: string;
	name: string;
	sprites: {
		other: {
			showdown: {
				front_default: string;
				back_default: string;
			}
		}
  };
  height: number;
  weight: number;
  types: TypeSlot[];
}

interface MainProps {
	searchQuery: string;
  }

  const Main: React.FC<MainProps> = ({ searchQuery }) => {
	const [pokemons, setPokemons] = useState<Pokemon[]>([]);
	const [pokeDetails, setPokeDetails] = useState<PokeDetail[]>([]);
  	const [loading, setLoading] = useState<boolean>(true);
	const [selectedPokemon, setSelectedPokemon] = useState<PokeDetail | null>(null);
	const router = useRouter();

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=101'); // Fetch first 20 Pokémon
				const data = await response.json();

				setPokemons(data.results);

				const pokemonDetails = data.results.map(async (pokemon: Pokemon) => {
          const detailResponse = await fetch(pokemon.url);
          return detailResponse.json();
				});

				const details = await Promise.all(pokemonDetails);
				console.log(details)
				setPokeDetails(details);
			} catch (error) {
        console.error("Error fetching Pokémon data:", error);
      } finally {
        setLoading(false);
      }
    };

		fetchPokemons();

		console.log(pokeDetails)
  }, []);

  const handlePokemonClick = (pokemonId: string) => {
    router.push(`/pokemon/${pokemonId}`);
  };

  const filteredPokemons = searchQuery
  ? pokeDetails.filter(pokemon => 
	  pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
	)
  : pokeDetails;

  console.log("Filtered Pokémon:", filteredPokemons);

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (router.pathname.includes('/pokemon/')) {
	return null; // Don't render anything if we're on a pokemon detail page
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 mt-28">
      {filteredPokemons.map((pokemon) => (
        <Card 
          key={pokemon.id} 
          pokemon={pokemon} 
          onClick={() => handlePokemonClick(pokemon.id)}
        />
      ))}
    </div>
  );
};

export default Main;
