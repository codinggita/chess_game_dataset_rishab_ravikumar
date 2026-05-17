const express = require('express');
const analyticsController = require('../controllers/analytics.controller');

const router = express.Router();

router.get('/victory-distribution', analyticsController.getVictoryDistribution);
router.get('/color-advantage', analyticsController.getColorAdvantage);
router.get('/turn-count-average', analyticsController.getTurnCountAverage);
router.get('/rated-vs-casual', analyticsController.getRatedVsCasual);
router.get('/time-control-usage', analyticsController.getTimeControlUsage);
router.get('/shortest-games', analyticsController.getShortestGames);
router.get('/longest-games', analyticsController.getLongestGames);

module.exports = router;
