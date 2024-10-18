import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { PokeDetail, TypeSlot } from '../../components/Main';

const PokemonDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;  // Extract the Pokémon ID from the URL
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

  const handleGoBack = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Pokemon not found</h2>
        <button 
          onClick={handleGoBack}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (

    <div className="max-w-4xl mx-auto p-8 mt-28">
    <button 
      onClick={handleGoBack}
      className="mb-4 text-blue-500 hover:text-blue-600 flex items-center"
    >
      ← Back to All Pokemon
    </button>
    
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Your existing detail view content */}
      <div className="bg-gradient-to-r from-blue-500 to-green-500 p-4">
        <h1 className="text-white text-3xl font-bold text-center capitalize">{pokemon.name}</h1>
      </div>
        {/* Main Content Section */}
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="md:w-1/2 p-8">
            <img
              className="mx-auto w-full h-auto object-contain transition-transform duration-300 ease-in-out hover:scale-105"
              src={pokemon.sprites.other.showdown.front_default}
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
