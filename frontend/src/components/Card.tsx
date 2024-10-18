import React from 'react';
import { PokeDetail } from './Main';

interface CardProps {
  pokemon: PokeDetail;
  onClick: () => void;
}

const Card: React.FC<CardProps> = ({ pokemon, onClick }) => {
  return (
    <div 
      key={pokemon.name} 
      className="border rounded-lg shadow-lg p-4 bg-white cursor-pointer hover:shadow-xl transition-shadow"
      onClick={onClick}
    >
      <div className="flex justify-center items-center">
        <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-blue-700 font-semibold text-lg shadow-md">
          #{pokemon.id}
        </span>
      </div>
      <div className="relative">
        <img
          className="mt-4 mx-auto h-20 w-20 object-contain transition-transform duration-300 ease-in-out hover:scale-110"
          src={pokemon.sprites.other.showdown.front_default} 
          alt={pokemon.id} 
        />
      </div>
      <h2 className="text-lg font-bold text-center mt-2">{pokemon.name}</h2>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className="text-blue-600 hover:underline block text-center mt-2 w-full"
      >
        View Details
      </button>
    </div>
  );
};

export default Card;
