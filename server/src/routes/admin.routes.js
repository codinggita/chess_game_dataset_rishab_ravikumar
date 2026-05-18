const express = require('express');
const adminController = require('../controllers/admin.controller');
const { protect } = require('../middlewares/auth.middleware');
const { adminOnly } = require('../middlewares/admin.middleware');

const router = express.Router();

router.use(protect, adminOnly);

router.get('/dashboard', adminController.getDashboard);
router.get('/users', adminController.listUsers);
router.get('/users/:id', adminController.getUser);
router.put('/users/:id/role', adminController.updateUserRole);
router.put('/users/:id/ban', adminController.banUser);
router.put('/users/:id/unban', adminController.unbanUser);
router.get('/matches/deleted', adminController.getDeletedMatches);
router.delete('/matches/:id', adminController.softDeleteMatch);
router.put('/matches/:id/restore', adminController.restoreMatch);

module.exports = router;
