import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PokeDetail } from '../types/type_Pokemon';
import { typeColors } from '../pokemonTypes'

const Card: React.FC<{ pokemon: PokeDetail }> = ({ pokemon }) =>
{
	const getColorClass = (type: keyof typeof typeColors) => {
		return typeColors[type]
	};
	return (
		<Link href={`/pokemon/${pokemon.id}`} passHref>
			<div key={pokemon.name} className="border rounded-lg shadow-lg p-4 bg-white">
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
					/>
				</div>
				<h2 className="text-lg font-bold text-center mt-2">{pokemon.name}</h2>
				<div className="flex justify-center mt-2">
					{pokemon.types.map((typeSlot) =>
						{
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
							)
						})}
        </div>
			</div>
		</Link>
  );
};

export default Card;
