export interface User {
  name: string;
  email: string;
	image?: string;
	level: number;
  exp: number;       // Experience points
  pokcoin: number;   // Pokémon coins
  friends: Array<string>; // Array of friend IDs or names
}
