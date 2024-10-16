import React, { useEffect, useState } from 'react';
import Card from './Card';

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

const Main: React.FC = () => {
	const [pokemons, setPokemons] = useState<Pokemon[]>([]);
	const [pokeDetails, setPokeDetails] = useState<PokeDetail[]>([]);
  	const [loading, setLoading] = useState<boolean>(true);
	const [selectedPokemon, setSelectedPokemon] = useState<PokeDetail | null>(null);

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

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
	<div>
	  {selectedPokemon ? (
		<div>
		  <h2>{selectedPokemon.name}</h2>
		  <img src={selectedPokemon.sprites.other.showdown.front_default} alt={selectedPokemon.name} />
		  {/* Add more details here */}
		  <button onClick={() => setSelectedPokemon(null)}>Go back</button>
		</div>
	  ) : (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 mt-28">
		  {pokeDetails.map((pokemon) => (
			<Card key={pokemon.name} pokemon={pokemon} onClick={() => setSelectedPokemon(pokemon)} />
		  ))}
		</div>
	  )}
	</div>
  );
};

export default Main;
