const express = require('express');
const adminController = require('../controllers/admin.controller');
const { protect } = require('../middlewares/auth.middleware');
const { adminOnly } = require('../middlewares/admin.middleware');
const { allowedMethods } = require('../utils/options');

const router = express.Router();

router.use(protect, adminOnly);

router.options('/users', allowedMethods(['GET']));
router.options('/system/health', allowedMethods(['GET']));
router.get('/dashboard', adminController.getDashboard);
router.get('/users', adminController.listUsers);
router.get('/users/:id', adminController.getUser);
router.patch('/users/:id/role', adminController.updateUserRole);
router.patch('/users/:id/ban', adminController.banUser);
router.patch('/users/:id/unban', adminController.unbanUser);
router.get('/matches/deleted', adminController.getDeletedMatches);
router.delete('/matches/:id', adminController.softDeleteMatch);
router.put('/matches/:id/restore', adminController.restoreMatch);
router.get('/logs', adminController.getLogs);
router.get('/system/health', adminController.getSystemHealth);
router.delete('/cache/clear', adminController.clearCache);
router.get('/protected/dashboard', adminController.getProtectedDashboard);

module.exports = router;
