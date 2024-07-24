import express from "express";
const router = express.Router();
import userController from "../controller/userController.js";
import security from "../middleware/authMiddleware.js";
import securityId from "../middleware/idMiddleware.js";
import securityAdmin from "../middleware/adminMiddleware.js";
//const authMiddleware = require('../middleware/authMiddleware');

//router.get('/profile', authMiddleware, getProfile);
router.get('/', securityAdmin, userController.getAll);
router.get('/:id', security, securityId, userController.getProfile);
//route admin
router.get('/admin/:id', securityAdmin, userController.getProfile);
router.put('/', security, securityId, userController.updateUser);
router.delete("/Favoris", security, securityId, userController.delFavorite);
router.delete("/:id", security, securityId, userController.deleteUser);
router.post('/listeLecture/', security, securityId, userController.creerListeLecture);
router.post('/listeLecture/:id', security, securityId, userController.ajouterFilmListeLecture);
router.get('/listeLecture/:id', security, securityId, userController.afficherListeLecture);
router.put('/listeLecture/:id', security, securityId, userController.modifierListeLecture);
router.post('/Favoris', security, securityId, userController.addFavorite);
router.get('/Favoris/:id', security, securityId, userController.affFavoris);

export default router;
