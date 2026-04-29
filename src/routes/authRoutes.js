const express = require('express');
const router = express.Router();
const { login, logout, getCurrentUser, refreshToken } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

// Public routes
router.post('/login', login);
router.post('/refresh', refreshToken);

// Protected routes
router.post('/logout', authMiddleware, logout);
router.get('/me', authMiddleware, getCurrentUser);

module.exports = router;