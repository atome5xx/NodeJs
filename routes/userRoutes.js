const express = require('express');
const { getProfile } = require('../controller/userController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/profile', authMiddleware, getProfile);

module.exports = router;
