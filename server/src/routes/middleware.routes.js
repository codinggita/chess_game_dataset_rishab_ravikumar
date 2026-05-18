const express = require('express');
const middlewareController = require('../controllers/middleware.controller');

const router = express.Router();

router.get('/logger', middlewareController.getLogger);
router.get('/auth', middlewareController.getAuth);
router.get('/rate-limit', middlewareController.getRateLimit);
router.get('/error-handler', middlewareController.getErrorHandler);

module.exports = router;
