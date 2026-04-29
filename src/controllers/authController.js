const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = User.getByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, roles: JSON.parse(user.roles) },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      user: {
        id: user.id,
        email: user.email,
        roles: JSON.parse(user.roles),
        name: user.name
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.logout = async (req, res) => {
  // In a real app, you might want to blacklist the token
  res.json({ success: true });
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = User.getByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      roles: JSON.parse(user.roles),
      name: user.name
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const user = User.getById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const newAccessToken = jwt.sign(
      { userId: user.id, email: user.email, roles: JSON.parse(user.roles) },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
};