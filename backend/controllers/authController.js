const UserModel = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUsers = await UserModel.getByEmail(email);
    if (existingUsers && existingUsers.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userId = await UserModel.create({ username, password: hashedPassword, email });

    const token = jwt.sign(
      { userId, username },
      'your_jwt_secret',
      { expiresIn: '1h' }
    );

    res.status(201).json({ message: 'User registered successfully', token, userId });
  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ error: 'Failed to register user: ' + error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    let users;
    try {
      users = await UserModel.getByEmail(email);
    } catch (error) {
      console.error('Error fetching user by email:', error);
      return res.status(500).json({ error: 'Failed to fetch user: ' + error.message });
    }

    if (!Array.isArray(users) || users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users[0];
    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user.userId, username: user.username },
      'your_jwt_secret',
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token, userId: user.userId });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ error: 'Failed to login: ' + error.message });
  }
};