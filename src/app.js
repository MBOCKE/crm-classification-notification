const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { authMiddleware } = require('./middleware/auth');
const { errorHandler } = require('./middleware/errorHandler');
const logger = require('./config/logger');

const classificationRoutes = require('./routes/classificationRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const internalRoutes = require('./routes/internalRoutes');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000;
const maxRequests = Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100;
const limiter = rateLimit({
  windowMs,
  max: maxRequests,
});
app.use('/api', limiter);

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Health check (public)
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API routes (protected by JWT)
app.use('/api/auth', authRoutes);
app.use('/api/v1/classify', authMiddleware, classificationRoutes);
app.use('/api/v1/notifications', authMiddleware, notificationRoutes);
app.use('/api/v1/admin', adminRoutes);   // admin routes include auth+admin check inside

// Internal routes (API key)
app.use('/internal', internalRoutes);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

module.exports = app;