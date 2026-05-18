const express = require('express');
const protectedController = require('../controllers/protected.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/matches/saved', protectedController.getSavedMatches);
router.post('/matches/:id/save', protectedController.saveMatch);
router.delete('/matches/:id/save', protectedController.unsaveMatch);
router.get('/profile/stats', protectedController.getProfileStats);

module.exports = router;
