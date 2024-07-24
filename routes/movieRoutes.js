import express from "express";
import securityAdmin from "../middleware/adminMiddleware.js";

const router = express.Router();

import movieController from "../controller/movieController.js";

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: Movie management and retrieval
 */

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Retrieve a list of all movies
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: A list of movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   year:
 *                     type: integer
 *                   rating:
 *                     type: number
 *                   actors:
 *                     type: array
 *                     items:
 *                       type: string
 */
router.get("/", movieController.getAll);

/**
 * @swagger
 * /movies/creationFilm:
 *   get:
 *     summary: Render a page to create a new movie
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: Movie creation page rendered
 */
router.get("/creationFilm", securityAdmin, movieController.createFilm);

/**
 * @swagger
 * /movies/search:
 *   get:
 *     summary: Search for movies by title, year, or rating
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Title of the movie
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Release year of the movie
 *       - in: query
 *         name: rating
 *         schema:
 *           type: number
 *         description: Rating of the movie
 *     responses:
 *       200:
 *         description: A list of movies matching the search criteria
 *       400:
 *         description: Invalid year or rating
 *       404:
 *         description: No matching movies found
 */
router.get("/search", movieController.searchMovie);

/**
 * @swagger
 * /movies/{params}:
 *   get:
 *     summary: Retrieve a movie by ID, optionally for modification
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: params
 *         required: true
 *         description: ID of the movie, optionally with '&modif' to modify
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single movie
 *       404:
 *         description: Movie not found
 */
router.get("/:params", movieController.getById);

/**
 * @swagger
 * /movies/{id}:
 *   delete:
 *     summary: Delete a movie by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the movie to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 *       404:
 *         description: Movie not found
 */
router.delete("/:id", securityAdmin, movieController.deleteMovie);

/**
 * @swagger
 * /movies/{id}:
 *   put:
 *     summary: Update a movie by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the movie to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               year:
 *                 type: integer
 *               rating:
 *                 type: number
 *               actors:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *       404:
 *         description: Movie not found
 */
router.put("/:id", securityAdmin, movieController.updateMovie);

/**
 * @swagger
 * /movies:
 *   post:
 *     summary: Add a new movie
 *     tags: [Movies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               year:
 *                 type: integer
 *               rating:
 *                 type: number
 *               actors:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Movie added successfully
 *       500:
 *         description: Server error
 */
router.post("/", securityAdmin, movieController.addMovie);

export default router;