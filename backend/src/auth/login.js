const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { findUserByUsername } = require('./userModel');

const login = async (req, res) => {
	const { username, password, auth_method } = req.body;

	console.log('login fire')

  // Find the user by username
	const user = await findUserByUsername(username);
  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
	}

	if (auth_method === 'local')
	{
		console.log(local)
		const isMatch = await bcrypt.compare(password, user.password_hash);
		if (!isMatch)
		{
			return res.status(401).json({ message: 'Invalid username or password' });
		}
	}

	console.log('google')

	const { password_hash, ...userWithoutPassword } = user;

	const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: '2h' });

	console.log(token)

	// const favoritePokemons = await findFavoritesByUserId(user.id);

	res.status(200).json({ message: 'Login successful', token, user: userWithoutPassword });

	console.log('succeed?')
};

module.exports = { login };
