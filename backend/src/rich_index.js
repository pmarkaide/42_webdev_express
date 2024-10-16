const express = require('express');
const app = express();
const axios = require('axios');
const pool = require('./db');

// Example route to fetch Pokémon data from an external API
// app.get('/', async (req, res) => {
//   try {
//     const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/`);

//     // Sending the fetched data back to the frontend
// 	res.json(response.data);
// 	console.log(response.data);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch Pokémon data' });
//   }
// });

(async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Connected to DB:', res.rows[0]);
  } catch (err) {
    console.error('Database connection error:', err.stack);
  } finally {
    pool.end();
  }
})();

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
