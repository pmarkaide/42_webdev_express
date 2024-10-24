const pool = require('../db');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../auth/authMiddleware');

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

  try {
    const existingFavorite = await pool.query(
      'SELECT * FROM favorites WHERE user_id = $1 AND pokemon_id = $2',
      [userId, pokemonId]
    );
    if (existingFavorite.rows.length > 0) {
      return res.status(400).json({ message: 'This Pokémon is already in your favorites' });
    }

    await pool.query(
      'INSERT INTO favorites (user_id, pokemon_id) VALUES ($1, $2)',
      [userId, pokemonId]
    );
    res.status(201).json({ message: 'Favorite Pokémon added successfully' });
  } catch (error) {
    console.error('Error adding favorite Pokémon:', error);
    res.status(500).json({ error: 'Internal server error' });
  }getUserById
};

const removeFavoritePokemon = async (req, res) => {
  const { userId, pokemonId } = req.body;

  try {
    const existingFavorite = await pool.query(
      'SELECT * FROM favorites WHERE user_id = $1 AND pokemon_id = $2',
      [userId, pokemonId]
    );

    if (existingFavorite.rows.length == 0) {
      return res.status(400).json({ message: 'You can not remove your like without liking it.' });
    }

    // Insert the new favoritgetUserByIde into the favorites table
    await pool.query(
      'DELETE FROM favorites WHERE user_id = $1 AND pokemon_id = $2',
      [userId, pokemonId]
    );

    res.status(201).json({ message: 'Favorite Pokémon removed successfully' });
  } catch (error) {
    console.error('Error removing favorite Pokémon:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const editUserInfo = async (req, res) => {
  // const { id } = req.params;
  const { id, name, email } = req.body;

	const token = req.headers.authorization?.split(' ')[1];
	console.log(token)
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		console.log('parint: ' + parseInt(id))

    // Check if the user ID from token matches the ID in the URL
    if ((decoded.userId) !== parseInt(id)) {
      return res.status(403).json({ message: 'You are not authorized to edit this user' });
    }
    const result = await pool.query(
      'UPDATE users SET username = $1, email = $2 WHERE user_id = $3 RETURNING *',
      [name, email, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User information updated successfully', user: result.rows[0] });
  } catch (error) {
    console.error('Error updating user info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const searchUsers = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  let client;
  try {
    // Get a client from the pool
    client = await pool.connect();

    const result = await client.query(`
      SELECT user_id, username, email
      FROM users
      WHERE username ILIKE $1
      LIMIT 5
    `, [`%${query}%`]);

    console.log('Search query:', query);
    console.log('Query result:', result.rows);

    // Send response before releasing client
    res.json(result.rows);
  } catch (error) {
    console.error('Error searching users:', error);
    // Send a more specific error message
    res.status(500).json({ 
      error: 'Database error while searching users',
      details: error.message 
    });
  } finally {
    // Release the client back to the pool
    if (client) {
      try {
        client.release();
      } catch (err) {
        console.error('Error releasing client:', err);
      }
    }
  }
};

router.get('/search', searchUsers);
router.get('/', getAllUsers);
router.get('/:id', authenticateToken, getUserById);
router.get('/:id/favorites', getUserFavorites);
router.post('/favorites', addFavoritePokemon);
router.delete('/favorites', removeFavoritePokemon);
router.put('/:id', authenticateToken, editUserInfo);
module.exports = router;