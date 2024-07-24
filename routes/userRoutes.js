import express from "express";
const router = express.Router();
import userController from "../controller/userController.js";
import security from "../middleware/authMiddleware.js";
import securityId from "../middleware/idMiddleware.js";
import securityAdmin from "../middleware/adminMiddleware.js";

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and retrieval
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 */
router.get('/', securityAdmin, userController.getAll);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retrieve a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the user to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *       404:
 *         description: User not found
 */
router.get('/:id', security, securityId, userController.getProfile);

//route admin
/**
 * @swagger
 * /users/admin/{id}:
 *   get:
 *     summary: Retrieve a user by ID (Admin access)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the user to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single user
 *       404:
 *         description: User not found
 */
router.get('/admin/:id', securityAdmin, userController.getProfile);

/**
 * @swagger
 * /users:
 *   put:
 *     summary: Update a user's profile
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
router.put('/', security, securityId, userController.updateUser);

/**
 * @swagger
 * /users/Favoris:
 *   delete:
 *     summary: Delete a movie from user's favorites
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               movieId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Movie removed from favorites
 *       404:
 *         description: User or movie not found
 */
router.delete("/Favoris", security, securityId, userController.delFavorite);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the user to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete("/:id", security, securityId, userController.deleteUser);

/**
 * @swagger
 * /users/listeLecture:
 *   post:
 *     summary: Create a new reading list for a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Reading list created
 *       404:
 *         description: User not found
 */
router.post('/listeLecture/', security, securityId, userController.creerListeLecture);

/**
 * @swagger
 * /users/listeLecture/{id}:
 *   post:
 *     summary: Add a movie to the user's reading list
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movieId:
 *                 type: integer
 *               type:
 *                 type: integer
 *                 description: 1 for a_voir, 2 for vue, 3 for en_cours
 *     responses:
 *       200:
 *         description: Movie added to reading list
 *       404:
 *         description: User or movie not found
 */
router.post('/listeLecture/:id', security, securityId, userController.ajouterFilmListeLecture);

/**
 * @swagger
 * /users/listeLecture/{id}:
 *   get:
 *     summary: Display a user's reading list with movie titles
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User's reading list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 a_voir:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       titre:
 *                         type: string
 *                 vue:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       titre:
 *                         type: string
 *                 en_cours:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       titre:
 *                         type: string
 *       404:
 *         description: User not found
 */
router.get('/listeLecture/:id', security, securityId, userController.afficherListeLecture);

/**
 * @swagger
 * /users/listeLecture/{id}:
 *   put:
 *     summary: Modify a user's reading list
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               listeArrivee:
 *                 type: string
 *                 description: The list to move to (a_voir, vue, en_cours)
 *               movieId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Movie moved successfully
 *       404:
 *         description: User or movie not found
 */
router.put('/listeLecture/:id', security, securityId, userController.modifierListeLecture);

/**
 * @swagger
 * /users/Favoris:
 *   post:
 *     summary: Add a movie to user's favorites
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               movieId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Movie added to favorites
 *       404:
 *         description: User or movie not found
 */
router.post('/Favoris', security, securityId, userController.addFavorite);

/**
 * @swagger
 * /users/{id}/favoris:
 *   get:
 *     summary: Affiche les films favoris d'un utilisateur
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de l'utilisateur dont on veut afficher les favoris.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Liste des titres des films favoris de l'utilisateur.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 favoris:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "Inception"
 *       400:
 *         description: ID utilisateur invalide.
 *       404:
 *         description: Utilisateur non trouvé.
 *       500:
 *         description: Erreur serveur.
 */
router.get('/Favoris/:id', security, securityId, userController.affFavoris);

export default router;
