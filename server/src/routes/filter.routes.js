const express = require('express');
const matchController = require('../controllers/match.controller');
const { allowedMethods } = require('../utils/options');
const { headOk } = require('../utils/head');

const router = express.Router();

router.options('/blitz', allowedMethods(['GET']));
router.options('/checkmates', allowedMethods(['GET']));
router.head('/blitz', headOk);
router.head('/checkmates', headOk);

router.get('/white-wins', matchController.filterWhiteWins);
router.get('/black-wins', matchController.filterBlackWins);
router.get('/draws', matchController.filterDraws);

router.get('/rated', matchController.filterRated);
router.get('/unrated', matchController.filterUnrated);
router.get('/checkmates', matchController.filterCheckmates);
router.get('/resignations', matchController.filterResignations);
router.get('/timeouts', matchController.filterTimeouts);

router.get('/bullet', matchController.filterBullet);
router.get('/blitz', matchController.filterBlitz);
router.get('/rapid', matchController.filterRapid);
router.get('/classical', matchController.filterClassical);

router.get('/high-rated', matchController.filterHighRated);
router.get('/low-rated', matchController.filterLowRated);

router.get('/long-games', matchController.filterLongGames);

module.exports = router;
