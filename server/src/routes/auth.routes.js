const express = require('express');
const authController = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const { allowedMethods } = require('../utils/options');
const { headOk } = require('../utils/head');

const router = express.Router();

/**
 * Public Routes
 */
router.options('/login', allowedMethods(['POST']));
router.options('/register', allowedMethods(['POST']));
router.options('/profile', allowedMethods(['GET', 'PATCH', 'DELETE']));
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/refresh-token', authController.refresh);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

/**
 * Protected Routes
 */
router.post('/logout', protect, authController.logout);
router.post('/verify-email', protect, authController.verifyEmail);
router.head('/profile', protect, headOk);
router.get('/profile', protect, authController.getProfile);
router.patch('/profile', protect, authController.updateProfile);
router.delete('/profile', protect, authController.deleteProfile);

module.exports = router;
