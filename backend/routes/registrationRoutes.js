const express = require('express');
const { getRegistrations, createRegistration, deleteRegistration } = require('../controllers/registrationController');
const authenticate = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, getRegistrations);
router.post('/', authenticate, createRegistration);
router.delete('/:id', authenticate, deleteRegistration);

module.exports = router;