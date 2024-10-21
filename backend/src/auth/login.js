const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { findUserByUsername } = require('./userModel'); // Ensure this imports your user model

const login = async (req, res) => {
  const { username, password } = req.body;

  // Find the user by username
  const user = await findUserByUsername(username);
  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // Check if the password matches
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: '15min' });

  res.status(200).json({ message: 'Login successful', token });
};

module.exports = { login };
