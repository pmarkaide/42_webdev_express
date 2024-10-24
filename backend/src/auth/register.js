const bcrypt = require('bcrypt');
const { findUserByUsername, createUser } = require('./userModel');

const register = async (req, res) => {
  const { username, password } = req.body;

  // Check if the username already exists
  const existingUser = await findUserByUsername(username);
  if (existingUser) {
    return res.status(400).json({ message: 'Username already taken' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user
  const newUser = await createUser(username, hashedPassword);
  res.status(201).json({ message: 'User created', user: newUser });
};

module.exports = { register };
