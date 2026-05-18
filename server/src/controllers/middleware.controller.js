const apiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const middlewareController = {
  getLogger: asyncHandler(async (req, res) => {
    return apiResponse.success(res, 'Logger middleware info', {
      name: 'HTTP Request Logger',
      library: 'morgan',
      format: 'dev',
      description: 'Logs incoming HTTP requests with method, URL, status code, response time'
    });
  }),

  getAuth: asyncHandler(async (req, res) => {
    return apiResponse.success(res, 'Auth middleware info', {
      name: 'JWT Authentication',
      library: 'jsonwebtoken',
      type: 'Bearer token',
      description: 'Verifies JWT from Authorization header, attaches user to request',
      protectedFields: ['password', 'refreshToken', 'resetToken', 'resetTokenExpiry']
    });
  }),

  getRateLimit: asyncHandler(async (req, res) => {
    return apiResponse.success(res, 'Rate limit middleware info', {
      name: 'Rate Limiter',
      library: 'express-rate-limit',
      windowMs: 15 * 60 * 1000,
      maxRequests: 100,
      standardHeaders: true,
      legacyHeaders: false,
      description: 'Limits requests per IP to 100 per 15-minute window'
    });
  }),

  getErrorHandler: asyncHandler(async (req, res) => {
    return apiResponse.success(res, 'Error handler middleware info', {
      name: 'Global Error Handler',
      description: 'Catches and formats errors consistently',
      handledErrors: ['ValidationError', 'CastError', 'DuplicateKey (11000)', 'JsonWebTokenError', 'TokenExpiredError'],
      developmentLogging: true
    });
  })
};

module.exports = middlewareController;
