const express = require('express');
import userController from "../controller/userController.js";
//const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

//router.get('/profile', authMiddleware, getProfile);
router.get('/profile/:id', userController.getProfile);

export default router;
