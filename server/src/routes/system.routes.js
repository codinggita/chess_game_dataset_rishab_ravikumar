const express = require('express');
const systemController = require('../controllers/system.controller');

const router = express.Router();

router.get('/info', systemController.getInfo);
router.get('/health', systemController.getHealth);
router.get('/config', systemController.getConfig);
router.get('/logs', systemController.getLogs);
router.get('/version', systemController.getVersion);
router.get('/status', systemController.getStatus);
router.get('/uptime', systemController.getUptime);
router.get('/database/status', systemController.getDatabaseStatus);
router.get('/cache/status', systemController.getCacheStatus);
router.post('/recalculate-stats', systemController.recalculateStats);
router.post('/reindex', systemController.reindex);
router.post('/restart', systemController.restart);
router.get('/security/events', systemController.getSecurityEvents);
router.get('/performance', systemController.getPerformance);
router.get('/storage', systemController.getStorage);

module.exports = router;
