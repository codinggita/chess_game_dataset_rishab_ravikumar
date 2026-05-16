const express = require('express');
const matchController = require('../controllers/match.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * Public Routes (specific paths before parameterized)
 */
router.get('/', matchController.getAll);

/**
 * Special Queries (before /:id to avoid param capture)
 */
router.get('/latest', matchController.getLatestMatches);
router.get('/trending', matchController.getTrendingMatches);
router.get('/random', matchController.getRandomMatch);

/**
 * Bulk Operations (before /:id to avoid param capture)
 */
router.post('/bulk-upload', protect, matchController.bulkUpload);
router.patch('/bulk-update', protect, matchController.bulkUpdate);
router.post('/bulk-delete', protect, matchController.bulkDelete);
router.patch('/bulk/archive', protect, matchController.bulkArchive);
router.patch('/bulk/restore', protect, matchController.bulkRestore);

/**
 * Parameterized Routes
 */
router.get('/:id', matchController.getById);
router.get('/:id/moves', matchController.getMoves);
router.get('/:id/pgn', matchController.getPGN);
router.get('/:id/fen', matchController.getFEN);
router.get('/:id/analysis', matchController.getAnalysis);
router.patch('/:id/archive', protect, matchController.archive);
router.patch('/:id/restore', protect, matchController.restore);

/**
 * Protected Routes
 */
router.post('/', protect, matchController.create);
router.patch('/:id', protect, matchController.update);
router.delete('/:id', protect, matchController.delete);

module.exports = router;
