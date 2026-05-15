const express = require('express');
const matchController = require('../controllers/match.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * Public Routes
 */
router.get('/', matchController.getAll);
router.get('/:id', matchController.getById);

/**
 * Match Sub-resources
 */
router.get('/:id/moves', matchController.getMoves);
router.get('/:id/pgn', matchController.getPGN);
router.get('/:id/fen', matchController.getFEN);
router.get('/:id/analysis', matchController.getAnalysis);

/**
 * Special Queries
 */
router.get('/latest', matchController.getLatestMatches);
router.get('/trending', matchController.getTrendingMatches);
router.get('/random', matchController.getRandomMatch);

/**
 * Protected Routes
 */
router.post('/', protect, matchController.create);
router.patch('/:id', protect, matchController.update);
router.delete('/:id', protect, matchController.delete);

module.exports = router;
