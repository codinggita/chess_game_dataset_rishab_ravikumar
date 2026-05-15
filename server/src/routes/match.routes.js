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
 * Protected Routes
 */
router.post('/', protect, matchController.create);
router.patch('/:id', protect, matchController.update);
router.delete('/:id', protect, matchController.delete);

module.exports = router;
