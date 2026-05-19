const express = require('express');
const protectedController = require('../controllers/protected.controller');
const { protect } = require('../middlewares/auth.middleware');
const { allowedMethods } = require('../utils/options');

const router = express.Router();

router.use(protect);

router.options('/matches', allowedMethods(['GET', 'POST']));
router.options('/matches/:id', allowedMethods(['PATCH', 'DELETE']));
router.get('/matches', protectedController.listMatches);
router.post('/matches', protectedController.createMatch);
router.patch('/matches/:id', protectedController.updateMatch);
router.delete('/matches/:id', protectedController.deleteMatch);
router.get('/matches/saved', protectedController.getSavedMatches);
router.post('/matches/:id/save', protectedController.saveMatch);
router.delete('/matches/:id/save', protectedController.unsaveMatch);
router.get('/profile/stats', protectedController.getProfileStats);

module.exports = router;
