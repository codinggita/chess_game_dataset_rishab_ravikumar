const express = require('express');
const playerController = require('../controllers/player.controller');

const router = express.Router();

router.get('/', playerController.getAll);
router.get('/rating-range', playerController.getByRatingRange);
router.get('/compare/:player1/:player2', playerController.comparePlayers);
router.get('/:username', playerController.getByUsername);
router.get('/:username/history', playerController.getHistory);
router.get('/:username/stats', playerController.getStats);
router.get('/:username/openings', playerController.getOpenings);
router.get('/:username/rating-history', playerController.getRatingHistory);
router.get('/:username/win-rate', playerController.getWinRate);
router.get('/:username/loss-rate', playerController.getLossRate);
router.get('/:username/draw-rate', playerController.getDrawRate);

module.exports = router;
