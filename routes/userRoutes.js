import express from "express";

const router = express.Router();

import userController from "../controller/userController.js";
//const authMiddleware = require('../middleware/authMiddleware');

//router.get('/profile', authMiddleware, getProfile);
router.get('/', userController.getAll);
router.get('/:id', userController.getProfile);
router.put('/', userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.post('/listeLecture/', userController.creerListeLecture);
router.post('/listeLecture/:id', userController.ajouterFilmListeLecture);
router.get('/listeLecture/:id', userController.afficherListeLecture);
router.put('/listeLecture/:id', userController.modifierListeLecture);

export default router;
