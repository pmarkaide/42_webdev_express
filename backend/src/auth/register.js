const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import JWT library
const { findUserByUsername, findUserByEmail, findFavoritesByUserId, createUser } = require('./userModel');

const register = async (req, res) => {
  const { username, password, email } = req.body;

  // Check if the username already exists
  const existingUser = await findUserByUsername(username);
  if (existingUser) {
    return res.status(400).json({ message: 'Username already taken' });
	}

	const existingEmail = await findUserByEmail(email);
  if (existingEmail) {
    return res.status(400).json({ message: 'Email already taken' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user
	const newUser = await createUser(username, email, hashedPassword);

	const { password_hash, ...userWithoutPassword } = newUser;

  const token = jwt.sign({ id: newUser.id, username: newUser.username }, process.env.JWT_SECRET, {
    expiresIn: '1h', // Token expires in 1 hour
	});

	const favoritePokemons = await findFavoritesByUserId(user.user_id);

	res.status(201).json({ message: 'User created', token, user: { ...userWithoutPassword, favoritePokemons } });
};

module.exports = { register };
