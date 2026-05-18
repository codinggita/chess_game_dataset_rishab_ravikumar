const express = require('express');
const systemController = require('../controllers/system.controller');

const router = express.Router();

router.get('/info', systemController.getInfo);
router.get('/health', systemController.getHealth);
router.get('/config', systemController.getConfig);

module.exports = router;
