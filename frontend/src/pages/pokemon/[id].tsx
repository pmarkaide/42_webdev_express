import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { PokeDetail, TypeSlot } from '../../types/type_Pokemon'

const PokemonDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [pokemon, setPokemon] = useState<PokeDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      const fetchPokemon = async () => {
        try {
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
          const data = await response.json();
          setPokemon(data);
        } catch (error) {
          console.error("Error fetching Pokémon data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchPokemon();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!pokemon) {
    return <div>Pokemon not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8 mt-28">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-500 to-green-500 p-4">
          <h1 className="text-white text-3xl font-bold text-center">{pokemon.name}</h1>
        </div>

        {/* Main Content Section */}
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="md:w-1/2 p-8">
            <img
              className="mx-auto w-full h-auto object-contain transition-transform duration-300 ease-in-out hover:scale-105"
              src={pokemon.sprites.other.home.front_default}
              alt={pokemon.name}
            />
          </div>

          {/* Stats and Details Section */}
          <div className="md:w-1/2 p-8">
            <h2 className="text-xl font-bold mb-4">Stats</h2>
            <ul className="space-y-2">
              <li>
                <span className="font-semibold">ID:</span> {pokemon.id}
              </li>
              <li>
                <span className="font-semibold">Types:</span>
                {/* Map over the types array */}
                {pokemon.types.map((typeSlot: TypeSlot) => (
                  <span
                    key={typeSlot.type.name}
                    className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mt-2"
                  >
                    {typeSlot.type.name}
                  </span>
                ))}
              </li>
              <li>
                <span className="font-semibold">Height:</span> {pokemon.height}
              </li>
              <li>
                <span className="font-semibold">Weight:</span> {pokemon.weight}
              </li>
              {/* Add more details like abilities */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;
