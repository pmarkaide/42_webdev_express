const pool = require('../db');

const findUserByUsername = async (username) =>
{
	const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  return result.rows[0];
};

const findUserByEmail = async (email) =>
{
	const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
}

const findFavoritesByUserId = async (userId) => {
  const result = await pool.query(`
   	SELECT pokemon_id
    FROM favorites
    WHERE user_id = $1
  `, [userId]);
  return result.rows;
};

const fetchUserFavorites = async (userId) => {
	const favoritePokemonIds = await findFavoritesByUserId(userId);

  const fetchPromises = favoritePokemonIds.map(id =>
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
		.then(response => response.json())
  );

  const favoritePokemons = await Promise.all(fetchPromises);
  return favoritePokemons; // Return the fetched Pokémon data
};

const getUserFavorites = async (req, res) => {
	const userId = req.user.id; // Assuming you have the user ID from the token or session

  try {
		const favoritePokemons = await fetchUserFavorites(userId);
    res.status(200).json(favoritePokemons);
  } catch (error) {
		console.error('Error fetching favorites:', error);
    res.status(500).json({ message: 'Failed to fetch favorites' });
  }
};

const createUser = async (username, email, passwordHash, authMethod = 'local', image = null) =>
{
	const query = `
		INSERT INTO users (username, email, password_hash, auth_method, image, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *;
	`;
	const values = [username, email, passwordHash, authMethod, image];
	const result = await pool.query(query, values);
	return result.rows[0];
};

module.exports = {
	findUserByUsername,
	findUserByEmail,
	findFavoritesByUserId,
	getUserFavorites,
	createUser,
};
