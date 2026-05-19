const express = require('express');
const statsController = require('../controllers/stats.controller');
const { allowedMethods } = require('../utils/options');
const { headOk } = require('../utils/head');

const router = express.Router();

router.options('/total-matches', allowedMethods(['GET']));
router.head('/total-matches', headOk);
router.get('/total-matches', statsController.getTotalMatches);
router.get('/total-players', statsController.getTotalPlayers);
router.get('/average-rating', statsController.getAverageRating);
router.get('/top-openings', statsController.getTopOpenings);
router.get('/checkmate-rate', statsController.getCheckmateRate);
router.get('/resignation-rate', statsController.getResignationRate);
router.get('/timeout-rate', statsController.getTimeoutRate);
router.get('/white-win-rate', statsController.getWhiteWinRate);
router.get('/black-win-rate', statsController.getBlackWinRate);
router.get('/draw-rate', statsController.getDrawRate);
router.get('/rated-games', statsController.getRatedGames);
router.get('/unrated-games', statsController.getUnratedGames);
router.get('/daily-games', statsController.getDailyGames);
router.get('/monthly-games', statsController.getMonthlyGames);
router.get('/yearly-games', statsController.getYearlyGames);

module.exports = router;
