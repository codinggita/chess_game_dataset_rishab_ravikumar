const express = require('express');
const searchController = require('../controllers/search.controller');

const router = express.Router();

router.get('/matches', searchController.searchMatches);
router.get('/players', searchController.searchPlayers);
router.get('/openings', searchController.searchOpenings);
router.get('/eco', searchController.searchEco);
router.get('/moves', searchController.searchMoves);
router.get('/fuzzy', searchController.searchFuzzy);
router.get('/autocomplete', searchController.searchAutocomplete);
router.get('/recent', searchController.getRecent);
router.get('/popular', searchController.getPopular);

module.exports = router;
