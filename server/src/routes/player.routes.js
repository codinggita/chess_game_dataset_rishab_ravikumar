const express = require('express');
const playerController = require('../controllers/player.controller');
const { allowedMethods } = require('../utils/options');
const { headExists, headOk } = require('../utils/head');
const Match = require('../models/Match');

const router = express.Router();

router.options('/', allowedMethods(['GET']));
router.head('/', headOk);
router.options('/:username', allowedMethods(['GET']));
router.options('/:username/stats', allowedMethods(['GET']));
router.head('/:username', headExists(Match, req => ({ $or: [{ white_id: req.params.username }, { black_id: req.params.username }] })));
router.head('/:username/stats', headExists(Match, req => ({ $or: [{ white_id: req.params.username }, { black_id: req.params.username }] })));
router.get('/', playerController.getAll);
router.get('/top-rated', playerController.getTopRated);
router.get('/top-active', playerController.getTopActive);
router.get('/top-winning', playerController.getTopWinning);
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
router.get('/:username/recent', playerController.getRecent);

module.exports = router;
