const mongoose = require('mongoose');
const os = require('os');
const process = require('process');
const env = require('../config/env');
const apiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const systemController = {
  getInfo: asyncHandler(async (req, res) => {
    const info = {
      environment: env.NODE_ENV,
      nodeVersion: process.version,
      platform: os.platform(),
      arch: os.arch(),
      uptime: process.uptime(),
      hostname: os.hostname(),
      cpuCores: os.cpus().length,
      memory: {
        free: os.freemem(),
        total: os.totalmem(),
        usagePercent: `${((1 - os.freemem() / os.totalmem()) * 100).toFixed(1)}%`
      }
    };
    return apiResponse.success(res, 'System info fetched', info);
  }),

  getHealth: asyncHandler(async (req, res) => {
    const dbState = mongoose.connection.readyState;
    const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
    const health = {
      status: dbState === 1 ? 'healthy' : 'unhealthy',
      database: states[dbState] || 'unknown',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    };
    const statusCode = dbState === 1 ? 200 : 503;
    return apiResponse.success(res, 'Health check', health, {}, statusCode);
  }),

  getConfig: asyncHandler(async (req, res) => {
    return apiResponse.success(res, 'Config fetched', {
      environment: env.NODE_ENV,
      port: env.PORT
    });
  })
};

module.exports = systemController;
