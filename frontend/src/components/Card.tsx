import React from 'react';
import { PokeDetail } from './Main';

interface CardProps {
  pokemon: PokeDetail;
}

const Card: React.FC<CardProps> = ({ pokemon }) => {
  return (
    <div key={pokemon.name} className="border rounded-lg shadow-lg p-4 bg-white">
      {/* ID Styling */}
      <div className="flex justify-center items-center">
        <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-blue-700 font-semibold text-lg shadow-md">
          #{pokemon.id}
        </span>
      </div>
			<div className="relative">
				<img
					className="mt-4 mx-auto h-20 w-20 object-contain transition-transform duration-300 ease-in-out hover:scale-110"
					src={pokemon.sprites.other.showdown.front_default} alt={pokemon.id} />
      </div>

      <h2 className="text-lg font-bold text-center mt-2">{pokemon.name}</h2>
      <a
        href="#"
        className="text-blue-600 hover:underline block text-center mt-2"
        target="_blank"
        rel="noopener noreferrer"
      >
        View Details
      </a>
    </div>
  );
};

export default Card;
