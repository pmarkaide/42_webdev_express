// src/types.ts

export interface Pokemon {
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

export interface PokeDetail {
  id: string;
  name: string;
	sprites: {
	front_default: string;
    other: {
      showdown: {
        front_default: string;
        back_default: string;
      };
    };
  };
  height: number;
  weight: number;
  types: TypeSlot[];
}
