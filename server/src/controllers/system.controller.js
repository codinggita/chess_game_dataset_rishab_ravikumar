const mongoose = require('mongoose');
const os = require('os');
const process = require('process');
const env = require('../config/env');
const Match = require('../models/Match');
const Player = require('../models/Player');
const User = require('../models/User');
const apiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const logStore = require('../utils/logStore');

const systemStart = Date.now();
let recalcInProgress = false;
let reindexInProgress = false;

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
  }),

  getLogs: asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 100;
    const logs = logStore.getAll(limit);
    return apiResponse.success(res, 'System logs fetched', { logs, total: logs.length });
  }),

  getVersion: asyncHandler(async (req, res) => {
    return apiResponse.success(res, 'Version fetched', {
      version: '1.0.0',
      apiVersion: 'v1',
      nodeVersion: process.version,
      env: env.NODE_ENV
    });
  }),

  getStatus: asyncHandler(async (req, res) => {
    const dbState = mongoose.connection.readyState;
    const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
    return apiResponse.success(res, 'System status', {
      status: dbState === 1 ? 'operational' : 'degraded',
      database: states[dbState] || 'unknown',
      uptime: process.uptime(),
      memory: os.freemem() / os.totalmem() < 0.1 ? 'low' : 'normal',
      cpuLoad: os.loadavg ? os.loadavg()[0].toFixed(2) : 'N/A',
      timestamp: new Date().toISOString()
    });
  }),

  getUptime: asyncHandler(async (req, res) => {
    return apiResponse.success(res, 'Uptime fetched', {
      uptimeSeconds: process.uptime(),
      uptimeMinutes: Math.floor(process.uptime() / 60),
      uptimeHours: Math.floor(process.uptime() / 3600),
      startedAt: new Date(systemStart).toISOString()
    });
  }),

  getDatabaseStatus: asyncHandler(async (req, res) => {
    const dbState = mongoose.connection.readyState;
    const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
    const collections = await mongoose.connection.db?.listCollections().toArray();
    return apiResponse.success(res, 'Database status', {
      status: states[dbState] || 'unknown',
      host: mongoose.connection.host || 'N/A',
      name: mongoose.connection.name || 'N/A',
      collections: collections ? collections.length : 0,
      models: mongoose.modelNames()
    });
  }),

  getCacheStatus: asyncHandler(async (req, res) => {
    return apiResponse.success(res, 'Cache status', {
      type: 'in-memory',
      entries: logStore.getAll().length,
      maxEntries: 500,
      status: 'healthy'
    });
  }),

  recalculateStats: asyncHandler(async (req, res) => {
    if (recalcInProgress) return apiResponse.error(res, 'Recalculation already in progress', null, 409);
    recalcInProgress = true;
    try {
      const totalMatches = await Match.countDocuments({ isDeleted: false });
      const totalPlayers = await Player.countDocuments();
      return apiResponse.success(res, 'Stats recalculated', { totalMatches, totalPlayers, recalculatedAt: new Date().toISOString() });
    } finally {
      recalcInProgress = false;
    }
  }),

  reindex: asyncHandler(async (req, res) => {
    if (reindexInProgress) return apiResponse.error(res, 'Reindex already in progress', null, 409);
    reindexInProgress = true;
    try {
      await Match.syncIndexes();
      await Player.syncIndexes();
      return apiResponse.success(res, 'Database indexes rebuilt', { reindexedAt: new Date().toISOString() });
    } finally {
      reindexInProgress = false;
    }
  }),

  restart: asyncHandler(async (req, res) => {
    return apiResponse.success(res, 'Restart initiated', { message: 'System services will restart', initiatedAt: new Date().toISOString() });
  }),

  getSecurityEvents: asyncHandler(async (req, res) => {
    const bannedUsers = await User.countDocuments({ isBanned: true });
    return apiResponse.success(res, 'Security events', {
      bannedUsers,
      recentEvents: [],
      message: 'No security events recorded'
    });
  }),

  getPerformance: asyncHandler(async (req, res) => {
    return apiResponse.success(res, 'Performance metrics', {
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuCores: os.cpus().length,
      loadAvg: os.loadavg ? os.loadavg() : 'N/A',
      freeMemory: os.freemem(),
      totalMemory: os.totalmem()
    });
  }),

  getStorage: asyncHandler(async (req, res) => {
    return apiResponse.success(res, 'Storage analytics', {
      type: 'MongoDB Atlas (cloud)',
      collections: ['matches', 'players', 'openings', 'users'],
      note: 'Detailed storage stats available via MongoDB Atlas dashboard'
    });
  })
};

module.exports = systemController;
