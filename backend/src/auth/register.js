const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { findUserByUsername, findUserByEmail, findFavoritesByUserId, createUser } = require('./userModel');

const register = async (req, res) => {
	const { username, password, email, auth_method, image } = req.body;

  const existingUser = await findUserByUsername(username);
  if (existingUser) {
    return res.status(400).json({ message: 'Username already taken' });
	}

	const existingEmail = await findUserByEmail(email);
  if (existingEmail) {
    return res.status(400).json({ message: 'Email already taken' });
  }

	let hashedPassword = null; // init
  if (auth_method === 'local') {
    hashedPassword = await bcrypt.hash(password, 10); // Hash password only for local users
  }

	const newUser = await createUser(username, email, hashedPassword, auth_method, image);

	const { password_hash, ...userWithoutPassword } = newUser;

  const token = jwt.sign({ id: newUser.id, username: newUser.username }, process.env.JWT_SECRET, {
    expiresIn: '1h',
	});

	// const favoritePokemons = await findFavoritesByUserId(user.user_id);
	const favoritePokemons = null;

	res.status(201).json({ message: 'User created', token, user: { ...userWithoutPassword, favoritePokemons } });
};

module.exports = { register };
