import express from "express";

const router = express.Router();

import userController from "../controller/userController.js";
//const authMiddleware = require('../middleware/authMiddleware');

//router.get('/profile', authMiddleware, getProfile);
router.get('/', userController.getAll);
router.get('/:id', userController.getProfile);
router.post('/', userController.updateUser);

export default router;
