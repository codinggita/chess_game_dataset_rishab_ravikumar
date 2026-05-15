const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const logger = require('./middlewares/logger.middleware');
const rateLimiter = require('./middlewares/rateLimiter.middleware');
const errorHandler = require('./middlewares/error.middleware');
const authRoutes = require('./routes/auth.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(logger);
app.use(rateLimiter);

// Routes
app.use('/api/v1/auth', authRoutes);

// Basic Route
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy' });
});

// Error Handling Middleware
app.use(errorHandler);

module.exports = app;
