const express = require('express');
const openingController = require('../controllers/opening.controller');

const router = express.Router();

router.get('/', openingController.getAll);
router.get('/popular', openingController.getPopular);
router.get('/trending', openingController.getTrending);
router.get('/win-rates', openingController.getWinRates);
router.get('/search', openingController.search);
router.get('/eco/:ecoCode', openingController.getByEco);

module.exports = router;
