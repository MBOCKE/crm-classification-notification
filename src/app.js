const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const classificationRoutes = require('./routes/classificationRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const internalRoutes = require('./routes/internalRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/classification', classificationRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/internal', internalRoutes);

app.use(errorHandler);

module.exports = app;
