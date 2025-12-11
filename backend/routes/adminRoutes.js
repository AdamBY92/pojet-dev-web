const express = require('express');
const { getStats } = require('../controllers/adminController');
const authenticate = require('../middleware/auth');

const router = express.Router();

router.get('/stats', authenticate, getStats);

module.exports = router;