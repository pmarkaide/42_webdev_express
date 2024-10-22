require('dotenv').config();
const express = require('express');
const app = express();
const axios = require('axios');
const pool = require('./db');

//This will allow you make the api call in frontend
const cors = require('cors');
app.use(cors());

const { register } = require('./auth/register');
const { login } = require('./auth/login');
const { authenticateToken } = require('./auth/authMiddleware');

app.use(express.json())

// Example route to fetch Pokémon data from an external API
app.get('/api/pokemons', async (req, res) => {
  try {
		const offset = req.query.offset || 0;
		const limit = req.query.limit || 32;

    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    // Sending the fetched data back to the frontend
		res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Pokémon data' });
  }
});

// app.get('/api/pokemon-likes', async (req, res) => {
//   try {
//     const result = await pool.query(`
//       SELECT pokemon_id, COUNT(user_id) AS likes
//       FROM favorites
//       GROUP BY pokemon_id
//     `);
//     res.json(result.rows); // Return the Pokémon likes count
//   } catch (error) {
//     console.error('Error fetching Pokémon likes:', error);
//     res.status(500).json({ error: 'Failed to fetch Pokémon likes count' });
//   }
// });

// Your existing backend API route to fetch Pokémon with likes
// app.get('/api/pokemons_with_likes', async (req, res) => {
//   try {
//     // Fetch Pokémon data
// 		// const pokemons = await pool.query('SELECT * FROM pokemons');
// 		const offset = req.query.offset || 0;
// 		const limit = req.query.limit || 32;

// 		const pokemons = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
// 		// console.log(pokemons.data.results)

// 		const pokemonsDetails = pokemons.data.results.map(async (pokemon) => {
// 			const detailResponse = await fetch(pokemon.url);
// 			return detailResponse.json();
// 		});
// 		// const pokemonsDetail = fetch(pokemons.url);

// 		// console.log(pokemonsDetails)

//     // Fetch likes data
// 		const likes = await pool.query('SELECT * FROM favorites');

// 		console.log(likes.rows)

//     // Combine Pokémon with likes
//     const combinedData = pokemonsDetails?.map(pokemon => {
//       const like = likes.rows.find(l => l.pokemon_id === pokemon.id);
//       return { ...pokemon, likes: like ? like.likes : 0 };
// 		});

// 		console.log(combinedData)

//     res.json(combinedData);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

app.get('/api/pokemons_with_likes', async (req, res) => {
  try {
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 32;

    // Fetch Pokémon data
    const pokemonsResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    const pokemons = pokemonsResponse.data.results;

    // Fetch likes data
    const likesResult = await pool.query(`
      SELECT pokemon_id, COUNT(user_id) AS likes
      FROM favorites
      GROUP BY pokemon_id
    `);

    // Create a map for quick look-up of likes by pokemon_id
    const likesMap = new Map(likesResult.rows.map(like => [like.pokemon_id, parseInt(like.likes)]));

    // Fetch detailed Pokémon data and combine with likes
    const combinedData = await Promise.all(pokemons.map(async (pokemon) => {
      const detailResponse = await axios.get(pokemon.url); // Fetch details
      const likes = likesMap.get(detailResponse.data.id) || 0; // Get likes count or default to 0
      return { ...detailResponse.data, likes }; // Combine details with likes
    }));

    res.json(combinedData); // Send combined data
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.get('/api/users/', async (req, res) => {
  try {
    const users = await pool.query('SELECT username FROM users');

   if (users.rows.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    res.json({ users: users.rows });
  } catch (err) {
    console.error('Error executing query:', err.message);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

app.post('/api/register', register);
app.post('/api/login', login);
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route.', user: req.user });
});

// Check database connection
pool.connect()
  .then(client => {
    console.log('Database connected successfully');
    client.release();
  })
  .catch(err => {
    console.error('Database connection error:', err.message);
  });

app.listen(process.env.BACKEND_PORT, () => {
  console.log(`Server running on port ${process.env.BACKEND_PORT}`);
});
