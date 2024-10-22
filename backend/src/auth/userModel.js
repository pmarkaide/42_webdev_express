const pool = require('../db');

const findUserByUsername = async (username) =>
{
	const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  return result.rows[0];
};

const createUser = async (username, email, passwordHash) => {
  const query = `
    INSERT INTO users (username, email, password_hash, created_at, updated_at)
    VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *;
  `;
  const values = [username, email, passwordHash];
  const result = await pool.query(query, values);
  return result.rows[0];
};


module.exports = {
  findUserByUsername,
  createUser,
};
