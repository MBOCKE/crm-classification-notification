const app = require('./src/app');
const { initializeDatabase } = require('./src/config/database');
const logger = require('./src/config/logger');

const PORT = process.env.PORT || 3001;

// Initialise database
initializeDatabase();

const server = app.listen(PORT, () => {
  logger.info(`Classification & Notification Service running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, closing server...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});