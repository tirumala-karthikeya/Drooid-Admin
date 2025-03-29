const express = require('express');
const router = express.Router();
const { login, logout, verifyToken } = require('../controllers/authController');

// Only keep necessary routes
router.post('/login', login);
router.post('/logout', logout);
router.get('/verify', verifyToken);

module.exports = router; 