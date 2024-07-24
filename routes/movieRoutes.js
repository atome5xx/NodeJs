import express from "express";
import securityAdmin from "../middleware/adminMiddleware.js";

const router = express.Router();

import movieController from "../controller/movieController.js";

router.get("/", movieController.getAll);
router.get("/creationFilm", securityAdmin, movieController.createFilm);
router.get("/search", movieController.searchMovie);
router.get("/:params", movieController.getById);
router.delete("/:id", securityAdmin, movieController.deleteMovie);
router.put("/:id", securityAdmin, movieController.updateMovie);
router.post("/", securityAdmin, movieController.addMovie);

export default router;