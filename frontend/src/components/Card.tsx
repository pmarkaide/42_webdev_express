import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PokeDetail } from '../types/type_Pokemon';
import { typeColors } from '../pokemonTypes';
import Heart from './Heart';
import { User } from '@/types/type_User';

const Card: React.FC<{ pokemon: PokeDetail, userPageMode: boolean, isFavorite: boolean, user: User }> = ({ pokemon, userPageMode = false, isFavorite, user}) => {
	const [isFilled, setIsFilled] = useState(isFavorite);

	console.log(user)

	useEffect(() => {
    if (userPageMode) {
      setIsFilled(true);
    } else {
      setIsFilled(isFavorite);
    }
  }, [userPageMode, isFavorite]);

  const getColorClass = (type: keyof typeof typeColors) => {
    return typeColors[type];
	};

	const toggleFavorite = async (e: React.MouseEvent) => {
		e.preventDefault();
		setIsFilled(prev => !prev); // Toggle the visual state (frontend)

    const response = await fetch(`${process.env.NEXT_PUBLIC_MY_BACKEND_API_URL}/api/users/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.user_id,
        pokemonId: pokemon.id,
      }),
    });

    if (!response.ok) {
      console.error('Failed to toggle favorite:', await response.json());
      // Optionally handle errors here
    }
  };

  return (
    <Link href={`/pokemon/${pokemon.id}`} passHref>
			<div key={pokemon.name} className={`border rounded-lg shadow-lg p-4 bg-white relative ${userPageMode ? 'bg-white' : 'bg-white'} `}>
				{pokemon.likes === 0 ? null : <span className='absolute top-5 right-11'>{pokemon.likes}</span> }
        <button
          onClick={toggleFavorite}
          className="absolute top-6 right-5 focus:outline-none w-5"
				>
          <Heart isFilled={isFilled} />
        </button>
        <div className="flex justify-center items-center">
          <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-blue-700 font-semibold text-lg shadow-md">
            #{pokemon.id}
          </span>
        </div>
        <div className="relative">
          <Image
            className="mt-4 mx-auto h-20 w-20 object-contain transition-transform duration-300 ease-in-out hover:scale-125"
            src={pokemon.sprites.other.showdown.front_default || pokemon.sprites.front_default}
            alt={pokemon.name}
            width={80}
            height={80}
            priority={true}
						layout="fixed"
						// unoptimized
          />
        </div>
        <h2 className="text-lg font-bold text-center mt-2">{pokemon.name}</h2>
        <div className="flex justify-center mt-2">
          {pokemon.types.map((typeSlot) => {
            const type = typeSlot.type.name as keyof typeof typeColors;
            const colorClass = getColorClass(type);

            return (
              <span
                key={typeSlot.type.name}
                style={{
                  padding: '4px 8px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  marginRight: '8px',
                  backgroundColor: colorClass.backgroundColor,
                  color: type === 'dark' ? colorClass.color : 'inherit',
                  borderRadius: '8px',
                  display: 'inline-block',
                }}
              >
                {typeSlot.type.name}
              </span>
            );
          })}
        </div>
      </div>
    </Link>
  );
};

export default Card;
