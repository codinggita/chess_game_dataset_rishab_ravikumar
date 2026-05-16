const express = require('express');
const playerController = require('../controllers/player.controller');

const router = express.Router();

router.get('/', playerController.getAll);
router.get('/:username', playerController.getByUsername);

module.exports = router;
