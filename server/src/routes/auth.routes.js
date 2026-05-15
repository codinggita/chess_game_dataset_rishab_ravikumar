const express = require('express');
const authController = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * Public Routes
 */
router.post('/register', authController.register);
router.post('/login', authController.login);

/**
 * Protected Routes
 */
router.post('/logout', protect, authController.logout);
router.get('/profile', protect, authController.getProfile);
router.patch('/profile', protect, authController.updateProfile);
router.delete('/profile', protect, authController.deleteProfile);

module.exports = router;
