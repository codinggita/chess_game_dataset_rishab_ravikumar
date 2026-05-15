const express = require('express');
const cors = require('cors');

const logger = require('./middlewares/logger.middleware');
const rateLimiter = require('./middlewares/rateLimiter.middleware');
const errorHandler = require('./middlewares/error.middleware');
const morgan = require('morgan');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use(logger);
app.use(rateLimiter);
app.use(morgan('dev'));

// Basic Route
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy' });
});

module.exports = app;
