const pool = require('../db');

const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.*,
        ARRAY(SELECT pokemon_id FROM favorites f WHERE f.user_id = u.user_id) AS favorite_pokemon_ids
      FROM users u
    `);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    // Fetch Pokémon details from PokeAPI based on favorite IDs
    const usersWithFavorites = await Promise.all(result.rows.map(async user => {
      const favoritePokemonIds = user.favorite_pokemon_ids || [];
      const pokemonDetailsPromises = favoritePokemonIds.map(async (pokemonId) => {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        const data = await response.json();
        return data;
      });
      const pokemonDetails = await Promise.all(pokemonDetailsPromises);
      return { ...user, favorites: pokemonDetails };
    }));

    res.json(usersWithFavorites);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fetch a single user by ID along with their favorite Pokémon
const getUserById = async (req, res) => {
	const { id } = req.params;

  try {
    const result = await pool.query(`
      SELECT u.*,
        ARRAY(SELECT pokemon_id FROM favorites f WHERE f.user_id = u.user_id) AS favorite_pokemon_ids
      FROM users u
      WHERE u.user_id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.rows[0];
    const favoritePokemonIds = user.favorite_pokemon_ids || [];

    // Fetch Pokémon details for the user's favorites
    const pokemonDetailsPromises = favoritePokemonIds.map(async (pokemonId) => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
      const data = await response.json();
      return data;
    });

    const pokemonDetails = await Promise.all(pokemonDetailsPromises);

    // Combine user data with their favorite Pokémon details
    res.json({ ...user, favorites: pokemonDetails });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fetch Pokémon details by user ID
const getUserFavorites = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the favorite Pokémon IDs for the user
    const result = await pool.query(
      'SELECT pokemon_id FROM favorites WHERE user_id = $1',
      [id]
    );

		const favoritePokemonIds = result.rows.map(row => row.pokemon_id);

		console.log(favoritePokemonIds)

    if (favoritePokemonIds.length === 0) {
      return res.status(404).json({ message: 'No favorite Pokémon found for this user' });
    }

    // Fetch Pokémon details from the external API
    const pokemonDetailsPromises = favoritePokemonIds.map(async (pokemonId) => {
			const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
			const data = await response.json();
      return data;
    });

    const pokemonDetails = await Promise.all(pokemonDetailsPromises);

    // Send the Pokémon details to the frontend
    res.json(pokemonDetails);
  } catch (error) {
    console.error('Error fetching favorite Pokémon:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const addFavoritePokemon = async (req, res) => {
  const { userId, pokemonId } = req.body;
	console.log(userId)
	console.log(pokemonId)
  try {
    // Check if the user already has this Pokémon as a favorite
    const existingFavorite = await pool.query(
      'SELECT * FROM favorites WHERE user_id = $1 AND pokemon_id = $2',
      [userId, pokemonId]
    );

    if (existingFavorite.rows.length > 0) {
      return res.status(400).json({ message: 'This Pokémon is already in your favorites' });
    }

    // Insert the new favorite into the favorites table
    await pool.query(
      'INSERT INTO favorites (user_id, pokemon_id) VALUES ($1, $2)',
      [userId, pokemonId]
    );

    res.status(201).json({ message: 'Favorite Pokémon added successfully' });
  } catch (error) {
    console.error('Error adding favorite Pokémon:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = { getUserById, getAllUsers, getUserFavorites, addFavoritePokemon };